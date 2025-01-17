/*jslint node: true, indent: 2 */
'use strict';

let doBody = require('./helper/body');

module.exports = function (node, indent) {
  let codegen, str;
  codegen = this.process.bind(this);

  str = 'foreach' + this.ws + '(' + codegen(node.source, indent) + this.ws + 'as' + this.ws;
  if (node.key) {
    str += codegen(node.key, indent) + this.ws + '=>' + this.ws;
  }
  str += codegen(node.value, indent) + ')';
  if (node.shortForm) {
    str += ':' + this.nl;
  } else {
    str += this.ws + '{' + this.nl;
  }

  str += doBody.call(this, codegen, indent, node.body.children || [node.body]);
  if (node.shortForm) {
    str += indent + 'endforeach;';
  } else {
    str += indent + '}';
  }
  return str;
};
