const find = require('lodash/find');
const Engine = require('./engine');
const Body = require('./body');

module.exports = class Class extends Engine {
    constructor(ast, root) {
        super();
        this.ast = ast;
        this.root = root;
    }

    anonymous(value = true) {
        this.ast.isAnonymous = !! value;
        return this;
    }

    abstract(value = true) {
        this.ast.isAbstract = !! value;
        return this;
    }

    final(value = true) {
        this.ast.isFinal = !! value;
        return this;
    }

    readonly(value = true) {
        this.ast.isReadonly = !! value;
        return this;
    }

    interface () {
        this.ast.kind = 'interface';
        this.ast.name = this.ast.name.name;
        return this;
    }

    extends(extendsClass) {
        this.ast.extends = {
            kind: 'identifier',
            name: this.__setUseAndGetClass(extendsClass)
        };
        return this;
    }

    implements(implementsClass) {

        implementsClass = this.__setUseAndGetClass(implementsClass);

        if (! find(this.ast.implements, {name: implementsClass})) {

            if (! this.ast.implements) {

                this.ast.implements = [];
            }

            this.ast.implements.push({
                kind: 'identifier',
                name: implementsClass
            });
        }
        return this;
    }

    attribute(attributeName, ...args) {

        attributeName = this.__setUseAndGetClass(attributeName);

        let attributeFound = false;
        const newArguments = [];

        for (let argument of args) {
            newArguments.push(this.__valueToAst(argument));
        }

        // Check if the attribute already exists in the attribute groups
        for (let group of this.ast.attrGroups) {
            for (let attribute of group.attrs) {
                if (attribute.name === attributeName) {
                    // Update the existing attribute arguments
                    attribute.args = newArguments;
                    attributeFound = true;
                    break;
                }
            }
            if (attributeFound) break;
        }

        // If the attribute is not found, create and add it in a new group
        if (!attributeFound) {
            const newAttribute = {
                kind: 'attribute',
                name: attributeName,
                args: newArguments,
            };
            const newAttrGroup = {
                kind: 'attrgroup',
                attrs: [newAttribute],
            };
            this.ast.attrGroups.push(newAttrGroup);
        }

        return this;
    }

    trait(traitName) {

        traitName = this.__setUseAndGetClass(traitName);

        let traitFound = false;

        // Check if the trait already exists in the class
        for (let item of this.ast.body) {
            if (item.kind === 'traituse' && item.traits.some(trait => trait.name === traitName)) {
                traitFound = true;
                break;
            }
        }

        // If the trait is not found, add it
        if (!traitFound) {
            const traitUseNode = {
                kind: 'traituse',
                traits: [{
                    kind: 'name',
                    name: traitName
                }]
            };
            this.ast.body.unshift(traitUseNode);
        }

        return this;
    }

    deleteTrait(traitName) {

        traitName = this.__removeUseAndGetClass(traitName);

        let traitIndex = -1;

        for (let i = 0; i < this.ast.body.length; i++) {
            let item = this.ast.body[i];
            if (item.kind === 'traituse' && item.traits.some(trait => trait.name === traitName)) {
                traitIndex = i;
                break;
            }
        }

        if (traitIndex !== -1) {
            this.ast.body.splice(traitIndex, 1);
        }
    }

    constant(constantName, value, visibility = '') {

        value = this.__valueToAst(value);

        constantName = String(constantName).snake().toUpperCase();

        const existingConstant = this.ast.body.find(item =>
            item.kind === 'classconstant' &&
            item.constants.some(constant => constant.name.name === constantName)
        );

        if (existingConstant) {

            return this;
        }

        let insertIndex = this.ast.body.findIndex(item =>
            item.kind !== 'traituse'
        );

        if (insertIndex === -1) {
            insertIndex = this.ast.body.length;
        }

        const constantNode = {
            kind: 'classconstant',
            constants: [
                {
                    kind: 'constant',
                    name: {
                        kind: 'identifier',
                        name: constantName
                    },
                    value: value
                }
            ],
            visibility: visibility
        };

        // Insert the new constant at the found index
        this.ast.body.splice(insertIndex, 0, constantNode);

        return this;
    }

    publicConstant(constantName, value) {
        return this.constant(constantName, value, 'public');
    }

    protectedConstant(constantName, value) {
        return this.constant(constantName, value, 'protected');
    }

    privateConstant(constantName, value) {
        return this.constant(constantName, value, 'private');
    }

    deleteConstant(constantName) {

        constantName = String(constantName).snake().toUpperCase();

        for (let i = 0; i < this.ast.body.length; i++) {
            let item = this.ast.body[i];
            if (item.kind === 'classconstant') {
                const constantIndex = item.constants.findIndex(constant => constant.name.name === constantName);

                if (constantIndex !== -1) {
                    item.constants.splice(constantIndex, 1);

                    if (item.constants.length === 0) {
                        this.ast.body.splice(i, 1);
                    }
                    return this;
                }
            }
        }

        return this;
    }

    publicProperty(propertyName, newValue, comment = null) {
        return this.property(propertyName, newValue, 'public', false, comment);
    }

    protectedProperty(propertyName, newValue, comment = null) {
        return this.property(propertyName, newValue, 'protected', false, comment);
    }

    privateProperty(propertyName, newValue, comment = null) {
        return this.property(propertyName, newValue, 'private', false, comment);
    }

    staticPublicProperty(propertyName, newValue, comment = null) {
        return this.property(propertyName, newValue, 'public', true, comment);
    }

    staticProtectedProperty(propertyName, newValue, comment = null) {
        return this.property(propertyName, newValue, 'protected', true, comment);
    }

    staticPrivateProperty(propertyName, newValue, comment = null) {
        return this.property(propertyName, newValue, 'private', true, comment);
    }

    property(propertyName, newValue, visibility = 'public', isStatic = false, comment = null) {

        newValue = this.__valueToAst(newValue);

        let propertyFound = false;

        // Check if the property already exists in the class
        for (let property of this.ast.body) {
            if (property.kind === 'propertystatement' && property.properties[0].name.name === propertyName) {
                // Update the existing property value
                property.properties[0].value = newValue;
                property.visibility = visibility;
                property.isStatic = isStatic;
                if (comment) {
                    property.leadingComments = [{
                        kind: 'commentblock',
                        value: comment,
                    }];
                }
                propertyFound = true;
                break;
            }
        }

        // If the property is not found, create and add it
        if (!propertyFound) {
            let insertIndex = this.ast.body.findIndex(item => item.kind === 'method');
            if (insertIndex === -1) {
                insertIndex = this.ast.body.length;
            }
            const newProperty = {
                kind: 'propertystatement',
                properties: [{
                    kind: 'property',
                    name: {
                        kind: 'identifier',
                        name: propertyName,
                    },
                    value: newValue,
                }],
                visibility: visibility,
                isStatic: isStatic,
                leadingComments: comment ? [{
                    kind: 'commentblock',
                    value: comment,
                }] : null,
            };
            //this.ast.body.push(newProperty);
            this.ast.body.splice(insertIndex, 0, newProperty);
        }

        return this;
    }

    isExistsProperty(propertyName) {
        let propertyIndex = -1;

        for (let i = 0; i < this.ast.body.length; i++) {
            let item = this.ast.body[i];
            if (item.kind === 'propertystatement' && item.properties.some(prop => prop.name.name === propertyName)) {
                propertyIndex = i;
                break;
            }
        }

        return propertyIndex !== -1;
    }

    deleteProperty(propertyName) {
        let propertyIndex = -1;

        for (let i = 0; i < this.ast.body.length; i++) {
            let item = this.ast.body[i];
            if (item.kind === 'propertystatement' && item.properties.some(prop => prop.name.name === propertyName)) {
                propertyIndex = i;
                break;
            }
        }

        if (propertyIndex !== -1) {
            this.ast.body.splice(propertyIndex, 1);
        }
    }

    publicMethod(methodName, newBody, comment = null, type = null) {
        return this.method(methodName, newBody, 'public', false, comment, type);
    }

    protectedMethod(methodName, newBody, comment = null, type = null) {
        return this.method(methodName, newBody, 'protected', false, comment, type);
    }

    privateMethod(methodName, newBody, comment = null, type = null) {
        return this.method(methodName, newBody, 'private', false, comment, type);
    }

    staticPublicMethod(methodName, newBody, comment = null, type = null) {
        return this.method(methodName, newBody, 'public', true, comment, type);
    }

    staticProtectedMethod(methodName, newBody, comment = null, type = null) {
        return this.method(methodName, newBody, 'protected', true, comment, type);
    }

    staticPrivateMethod(methodName, newBody, comment = null, type = null) {
        return this.method(methodName, newBody, 'private', true, comment, type);
    }

    method(methodName, newBody = [], visibility = 'public', isStatic = false, comment = null, type = null) {

        let methodFound = false;

        // Check if the method already exists in the class
        for (let item of this.ast.body) {
            if (item.kind === 'method' && item.name.name === methodName) {

                if (type) {
                    item.type = {kind: "name", name: type, resolution: "uqn"};
                }

                if (newBody) {
                    if (typeof newBody === 'function') {
                        const $class = new Body(item.body.children, this);
                        newBody($class);
                        item.body.children = $class.ast
                    } else if (newBody) {
                        item.body = this.__codeToAst(newBody);
                    } else {
                        item.body = newBody;
                    }
                    item.visibility = visibility;
                    item.isStatic = isStatic;
                }
                if (comment) {
                    item.leadingComments = [{
                        kind: 'commentblock',
                        value: comment,
                    }];
                }
                methodFound = true;
                break;
            }
        }

        // If the method is not found, add it
        if (!methodFound) {
            if (typeof newBody === 'function') {
                const $class = new Body([], this);
                newBody($class);
                newBody = {
                    kind: 'block',
                    children: $class.ast
                }
                //console.log(newBody);
            } else if (newBody) {
                newBody = this.__codeToAst(newBody);
            }

            const methodNode = {
                kind: 'method',
                name: {
                    kind: 'identifier',
                    name: methodName
                },
                arguments: [],
                byref: false,
                type: type ? ({kind: "name", name: type, resolution: "uqn"}) : null,
                nullable: false,
                body: newBody,
                attrGroups: [],
                isAbstract: false,
                isFinal: false,
                isReadonly: false,
                visibility: visibility,
                isStatic: isStatic,
                leadingComments: comment ? [{
                    kind: 'commentblock',
                    value: comment,
                }] : null,
            };
            this.ast.body.push(methodNode);
        }

        return this;
    }

    isExistsMethod(methodName) {

        let methodIndex = -1;

        for (let i = 0; i < this.ast.body.length; i++) {
            let item = this.ast.body[i];
            if (item.kind === 'method' && item.name.name === methodName) {
                methodIndex = i;
                break;
            }
        }

        return methodIndex !== -1;
    }

    deleteMethod(methodName) {

        let methodIndex = -1;

        for (let i = 0; i < this.ast.body.length; i++) {
            let item = this.ast.body[i];
            if (item.kind === 'method' && item.name.name === methodName) {
                methodIndex = i;
                break;
            }
        }

        if (methodIndex !== -1) {
            this.ast.body.splice(methodIndex, 1);
        }

        return this;
    }

    countOfMethods () {
        return this.ast.body.filter(item => item.kind === 'method').length;
    }

    countOfProperties () {
        return this.ast.body.filter(item => item.kind === 'propertystatement').length;
    }

    countOfConstants () {
        return this.ast.body.filter(item => item.kind === 'classconstant').length;
    }

    when (condition, cb) {
        if (condition) {
            cb(this, condition);
        }
        return this;
    }

    unless (condition, cb) {
        if (!condition) {
            cb(this, condition);
        }
        return this;
    }
}
