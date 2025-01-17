const modifier = require('./php-modifier');

module.exports = class PhpBuilder {

    constructor (file) {
        this.modifier = new modifier(file);
        this.classBuilder = null;
    }

    namespace (name) {
        this.modifier.namespace(name);
        return this;
    }

    use (name) {
        this.modifier.use(name);
        return this;
    }

    deleteUse (name) {
        this.modifier.deleteUse(name);
        return this;
    }

    class (name = null) {
        this.classBuilder = this.modifier.class(name);
        return this;
    }

    anonymous (value = true) {
        this.classBuilder.anonymous(value);
        return this;
    }

    abstract (value = true) {
        this.classBuilder.abstract(value);
        return this;
    }

    final (value = true) {
        this.classBuilder.final(value);
        return this;
    }

    readonly (value = true) {
        this.classBuilder.readonly(value);
        return this;
    }

    extends (extendsClass) {
        this.classBuilder.extends(extendsClass);
        return this;
    }

    implements (implementsClass) {
        this.classBuilder.implements(implementsClass);
        return this;
    }

    attribute (attributeName, ...args) {
        this.classBuilder.attribute(attributeName, ...args);
        return this;
    }

    trait (traitName) {
        this.classBuilder.trait(traitName);
        return this;
    }

    constant (name, value) {
        this.classBuilder.constant(name, value);
        return this;
    }

    publicConstant (name, value) {
        this.classBuilder.publicConstant(name, value);
        return this;
    }

    protectedConstant (name, value) {
        this.classBuilder.protectedConstant(name, value);
        return this;
    }

    privateConstant (name, value) {
        this.classBuilder.privateConstant(name, value);
        return this;
    }

    publicProperty (name, value = null, comment = null) {
        this.classBuilder.publicProperty(name, value, comment);
        return this;
    }

    protectedProperty (name, value = null, comment = null) {
        this.classBuilder.protectedProperty(name, value, comment);
        return this;
    }

    privateProperty (name, value = null, comment = null) {
        this.classBuilder.privateProperty(name, value, comment);
        return this;
    }

    staticPublicProperty (name, value = null, comment = null) {
        this.classBuilder.staticPublicProperty(name, value, comment);
        return this;
    }

    staticProtectedProperty (name, value = null, comment = null) {
        this.classBuilder.staticProtectedProperty(name, value, comment);
        return this;
    }

    staticPrivateProperty (name, value = null, comment = null) {
        this.classBuilder.staticPrivateProperty(name, value, comment);
        return this;
    }

    publicMethod (name, body = null, comment = null, type = null) {
        this.classBuilder.publicMethod(name, body, comment, type);
        return this;
    }

    protectedMethod (name, body = null, comment = null, type = null) {
        this.classBuilder.protectedMethod(name, body, comment, type);
        return this;
    }

    privateMethod (name, body = null, comment = null, type = null) {
        this.classBuilder.privateMethod(name, body, comment, type);
        return this;
    }

    staticPublicMethod (name, body = null, comment = null, type = null) {
        this.classBuilder.staticPublicMethod(name, body, comment, type);
        return this;
    }

    staticProtectedMethod (name, body = null, comment = null, type = null) {
        this.classBuilder.staticProtectedMethod(name, body, comment, type);
        return this;
    }

    staticPrivateMethod (name, body = null, comment = null, type = null) {
        this.classBuilder.staticPrivateMethod(name, body, comment, type);
        return this;
    }

    countOfMethods () {
        return this.classBuilder.countOfMethods();
    }

    countOfProperties () {
        return this.classBuilder.countOfProperties();
    }

    countOfConstants () {
        return this.classBuilder.countOfConstants();
    }

    isExistsMethod (name) {
        return this.classBuilder.isExistsMethod(name);
    }

    isExistsProperty (name) {
        return this.classBuilder.isExistsProperty(name);
    }

    save () {
        return this.modifier.save();
    }
}
