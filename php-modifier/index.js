const fs = require('../helpers/HelperEasyFs');
const engineParser = require("php-parser");
const prettier = require("prettier");
const unparser = require('../php-unparser');
require('../helpers/stringPrototypes');
const phpPlugin = require("@prettier/plugin-php");
const Engine = require('./engine');
const ClassEntity = require('./class');

module.exports = class extends Engine {
    constructor(file) {
        super();
        this.root = this;
        this.file = file;
        if (! fs.exists(this.file)) {
            fs.put_contents(file, "<?php\n\n");
        }
        const parser = new engineParser({
            parser: {
                extractDoc: true,
                php7: true,
                version: "8.3",
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
        let fileData = fs.get_contents(this.file);

        if (! String(fileData).startsWith("<?php")) {
            fs.put_contents(file, "<?php\n\n");
            fileData = fs.get_contents(this.file);
        }

        this.parsed = parser.parseCode(fileData);
    }

    namespace (classNamespace) {
        if (classNamespace) {
            if (this.parsed.children[0] && this.parsed.children[0].kind === 'namespace') {
                this.parsed.children[0].name = classNamespace;
            } else {
                this.parsed.children = [{
                    kind: 'namespace',
                    name: classNamespace,
                    children: Object.assign([], this.parsed.children)
                }];
            }
        } else {
            if (this.parsed.children[0] && this.parsed.children[0].kind === 'namespace') {
                this.parsed.children = this.parsed.children[0].children;
            }
        }
        return this;
    }

    use (className, asName = null) {

        let addTo = this.parsed;

        if (this.parsed.children[0] && this.parsed.children[0].kind === 'namespace') {
            addTo = this.parsed.children[0];
        }

        let exists = false;

        for (const use of addTo.children) {
            if (use.kind === 'usegroup' && use.items[0].name === className) {
                if (asName) {
                    use.items[0].alias = {
                        kind: 'identifier',
                        name: asName
                    };
                } else {
                    use.items[0].alias = null;
                }
                exists = true;
            }
        }

        if (! exists) {

            const newChild = [];

            for (const child of addTo.children) {
                if (child.kind === 'usegroup') {
                    newChild.push(child);
                }
            }

            newChild.push({
                kind: 'usegroup',
                type: null,
                name: className,
                items: [{
                    kind: 'useitem',
                    name: className,
                    alias: asName ? {
                        kind: 'identifier',
                        name: asName
                    } : null
                }]
            });

            for (const child of addTo.children) {
                if (child.kind !== 'usegroup') {
                    newChild.push(child);
                }
            }

            addTo.children = newChild;
        }

        return this;
    }

    deleteUse(useName) {
        let programNode = this.parsed;

        if (this.parsed.children[0] && this.parsed.children[0].kind === 'namespace') {
            programNode = this.parsed.children[0];
        }

        let useIndex = -1;

        for (let i = 0; i < programNode.children.length; i++) {
            let item = programNode.children[i];
            if (item.kind === 'usegroup' && item.items[0].name === useName) {
                useIndex = i;
                break;
            }
        }

        if (useIndex !== -1) {
            programNode.children.splice(useIndex, 1);
        }
    }

    class (className) {
        let classFound = this.__searchClassInAst(this.parsed, className);

        if (classFound) {

            classFound.name = {
                kind: 'identifier',
                name: className
            };

            if (this.parsed.kind === 'program' && Array.isArray(this.parsed.children)) {

                const innerSearch = this.parsed.children[0].kind === 'namespace'
                    ? this.parsed.children[0]
                    : this.parsed;

                innerSearch.children = innerSearch.children.filter(
                    child => child.kind === 'usegroup'
                );
                innerSearch.children.push(classFound);
            }

            return new ClassEntity(classFound, this);
        }

        return new ClassEntity(
            this.__addClassToAst(className), this
        );
    }

    save() {
        let data = '';
        try {
            data = unparser(this.parsed, {
                indent: true,
                dontUseWhitespaces: false,
                shortArray: true,
                bracketsNewLine: true,
                forceNamespaceBrackets: false,
                collapseEmptyLines: true
            });
        } catch (e) {
            console.error(e);
            console.log(this.file);
        }

        if (data) {

            try {
                prettier.format(data, {
                    plugins: [phpPlugin],
                    parser: "php",
                    phpVersion: '8.1',
                    embeddedLanguageFormatting: 'off',
                }).then((result) => {

                    fs.put_contents(
                        this.file,
                        this.__removeUnusedUseStatements(result)
                    );
                });
            } catch (e) {
                console.error(e);
            }
        }
    }
}
