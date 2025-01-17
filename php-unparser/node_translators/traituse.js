/*jslint node: true, indent: 2 */
'use strict';

let identifier = require('./helper/identifier');

/**
 * Usage declaration
 */
module.exports = function (node, indent) {
  let str = 'use' + this.ws, items = [], glue, codegen;
  codegen = this.process.bind(this);
  node.traits.forEach(function (item) {
    items.push(
      codegen(item, indent)
    );
  });
  str += items.join(',' + this.ws);
  if (node.adaptations) {
    glue = this.nl +  indent + this.indent;
    str += this.ws + '{' + glue;
    str += node.adaptations.map(function (item) {
      let out = '';
      if (item.trait) {
        out += codegen(item.trait, indent) + '::';
      }
      if (item.method) {
        out += item.method;
      }
      if (item.kind === 'traitprecedence') {
        out += ' insteadof ';// + codegen(item.insteadof);
        out += item.instead.map(identifier).join(', ');
      } else {
        out += ' as ';
        if (item.visibility) {
          out += item.visibility + ' ';
        }
        out += item.as;
      }
      return out + ';';
    }).join(glue) + this.nl;
    str += indent + '}';
  } else {
    str += ';';
  }
  return str;
};
