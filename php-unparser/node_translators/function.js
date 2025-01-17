/*jslint node: true, indent: 2 */
'use strict';

let doBody = require('./helper/body');
let args = require('./helper/arguments');
let identifier = require('./helper/identifier');

// name, params, isRef, returnType, body
module.exports = function (node, indent) {
  let codegen, str;
  codegen = this.process.bind(this);

  str = 'function ';
  if (node.byref) {
    str += '&';
  }
  str += node.name;
  str += args(node.arguments, indent, this);

  // php7 / return type
  if (node.type) {
    str += this.ws + ':' + this.ws;
    if (node.nullable) {
      str += '?';
    }
    str += identifier(node.type);
  }

  if (this.options.bracketsNewLine) {
    str += this.nl + indent + '{' + this.nl;
  } else {
    str += this.ws + '{' + this.nl;
  }

  str += doBody.call(this, codegen, indent, node.body.children);
  str += indent + '}' + this.nl;

  return str;
};
