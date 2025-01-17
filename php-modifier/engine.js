const engineParser = require('php-parser');

module.exports = class Engine {

    __setUseAndGetClass(className) {
        const explodedClassNameByAs = String(className).split(' as ').map(item => item.trim());
        className = explodedClassNameByAs[0];
        const isAs = explodedClassNameByAs[1] || null;
        if (this.root) {
            if (String(className).indexOf('\\') !== -1) {

                this.root.use(className, isAs);
                if (isAs) {
                    return isAs;
                }
                const explodedClassName = String(explodedClassNameByAs[0]).split('\\');
                return explodedClassName[explodedClassName.length - 1];
            }
        }
        return isAs ? isAs : className;
    }

    __removeUseAndGetClass(className) {
        const explodedClassNameByAs = String(className).split(' as ').map(item => item.trim());
        className = explodedClassNameByAs[0];
        const isAs = explodedClassNameByAs[1] || null;
        if (this.root) {
            if (String(className).indexOf('\\') !== -1) {

                this.root.deleteUse(className);
                if (isAs) {
                    return isAs;
                }
                const explodedClassName = String(explodedClassNameByAs[0]).split('\\');
                return explodedClassName[explodedClassName.length - 1];
            }
        }
        return isAs ? isAs : className;
    }

    __codeToAst(code) {
        const parser = new engineParser({
            parser: {
                extractDoc: true,
                php7: true,
                version: "8.1",
            },
            ast: {
                //withPositions: true,
            },
            lexer: {
                all_tokens: true,
                comment_tokens: true,
                mode_eval: true,
                asp_tags: true,
                short_tags: true
            }
        });
        return parser.parseEval(code);
    }

    __valueToAst(value) {
        if (value === null || value === undefined) {
            value = 'null';
        } else if (Array.isArray(value)) {
            value = JSON.stringify(value);
        } else if (typeof value === 'object') {
            const items = [];
            for (let key in value) {
                // eslint-disable-next-line no-prototype-builtins
                if (value.hasOwnProperty(key)) {
                    items.push(`"${key}" => ${JSON.stringify(value[key])}`);
                }
            }
            value = `[${items.join(', ')}]`;
        } else {
            value = JSON.stringify(value);
        }

        return this.__codeToAst(`$var = ${value};`).children[0].expression.right;
    }

    __addClassToAst(className) {
        // First, check if the class already exists
        const existingClassNode = this.__searchClassInAst(this.parsed, className);
        if (existingClassNode) {
            return;
        }

        // Create a new class node
        const newClassNode = {
            kind: 'class',
            name: {
                kind: 'identifier',
                name: className
            },
            isAnonymous: false,
            extends: null,
            implements: null,
            body: [],
            attrGroups: [],
            isAbstract: false,
            isFinal: false,
            isReadonly: false,
        };

        // Assuming the root of the AST is a 'program' node with a 'children' array
        if (this.parsed.kind === 'program' && Array.isArray(this.parsed.children)) {
            this.parsed.children.push(newClassNode);
            return newClassNode;
        }
    }


    __searchClassInAst(node, className) {

        if (!node || typeof node !== 'object') return null;

        // if is interface
        if (node.kind === 'interface' && ((node.name && node.name.name === className) || node.isAnonymous)) {
            return node; // Return the found interface node
        }

        if (node.kind === 'class' && ((node.name && node.name.name === className) || node.isAnonymous)) {

            return node; // Return the found class node
        }

        for (let key in node) {
            // eslint-disable-next-line no-prototype-builtins
            if (node.hasOwnProperty(key)) {
                const child = node[key];
                if (Array.isArray(child)) {
                    for (let subNode of child) {
                        const foundNode = this.__searchClassInAst(subNode, className);
                        if (foundNode) return foundNode; // Class found in one of the child nodes
                    }
                } else if (typeof child === 'object') {
                    const foundNode = this.__searchClassInAst(child, className);
                    if (foundNode) return foundNode; // Class found in a nested node
                }
            }
        }

        return null; // Class not found
    }

    __removeUnusedUseStatements(data) {

        let classOrInterfaceMatch = data.match(/(return new class|class|abstract class|final class|interface)\s+[A-Za-z_][A-Za-z0-9_]*/);
        if (!classOrInterfaceMatch) return data;

        let classOrInterfaceIndex = classOrInterfaceMatch.index;
        let headerPart = data.substring(0, classOrInterfaceIndex);
        let classOrInterfacePart = data.substring(classOrInterfaceIndex);

        let matches = headerPart.match(/^use\s+([A-Za-z\\]+)(\s+as\s+([A-Za-z]+))?;/gm);
        if (!matches) return data;

        let namespaceMatch = headerPart.match(/namespace\s+([^;]+);/);
        let namespace = namespaceMatch ? namespaceMatch[1].trim() : '';

        matches.forEach(useStatement => {
            let [fullMatch, fullPath, , alias] = useStatement.match(/^use\s+([A-Za-z\\]+)(\s+as\s+([A-Za-z]+))?;/);
            let className = alias || fullPath.split('\\').pop();

            // Проверка, если класс из того же пространства имен
            if (namespace && fullPath.startsWith(namespace)) {
                headerPart = headerPart.replace(fullMatch, '');
                return;
            }

            // Проверка использования класса в части файла с классом или интерфейсом
            if (!classOrInterfacePart.includes(className)) {
                headerPart = headerPart.replace(fullMatch, '');
            }
        });

        // Удаление лишних пустых строк после блока use
        headerPart = headerPart.replace(/(\n\s*\n){2,}/g, '\n\n');

        // Удаление пустых строк между блоком комментария и началом класса
        data = headerPart + classOrInterfacePart;
        data = data.replace(/(\*\/)\n\s*\n+(class|interface|abstract class|final class|return new class)/, '$1\n$2');

        return data;
    }

}
