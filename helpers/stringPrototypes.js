const pluralize = require('pluralize');

String.prototype.ucFirst = function() {
    let str = this;
    if(str.length) {
        str = str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str;
};

String.prototype.pluralize = function() {
    return pluralize(this);
};

String.prototype.singular = function() {
    return pluralize.singular(this);
};

String.prototype.snake = function() {
    return this.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

String.prototype.camel = function() {
    return this.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

String.prototype.class_basename = function() {
    const explodedClass = this.split('\\');
    return explodedClass[explodedClass.length-1];
}

String.prototype.class_namespace = function() {
    const explodedClass = this.split('\\');
    explodedClass.pop();
    return explodedClass.join('\\');
}

String.prototype.slug = function() {

    return this
        .toLowerCase()
        .replace(/\n/g, '')
        .replace(/[\s\W-]+/g,'_')
        .replace(/^-+|_+$/g, '');
};

String.prototype.phpTrim = function(charlist) {
    let str = this;
    charlist = !charlist ? ' s\xA0' : charlist.replace(/([[\]().?/*{}+$^:])/g, '$1');
    const re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
    return str.replace(re, '');
};

String.prototype.is = function(pattern) {
    let text = this;
    pattern = pattern
        .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\#-]', 'g'), '\\$&')
        .replace(/\\\*/g, '.*');

    return (new RegExp(pattern + '$', 'u')).test(text);
}
