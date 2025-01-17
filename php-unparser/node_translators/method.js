/*jslint node: true, indent: 2 */
'use strict';

const doBody = require('./helper/body');
const args = require('./helper/arguments');
const identifier = require('./helper/identifier');
const map = require('./helper/map');

// name, params, isRef, returnType, body, flags
module.exports = function (node, indent) {

  let codegen = this.process.bind(this);
  let comments = "";

  if (node.leadingComments) {
    comments = map.bind(this)(node.leadingComments || [], '', "\n");
    //comments += this.nl + indent;
  }

  let attributes = map.bind(this)(node.attrGroups || [], '', "\n");

  if (attributes) {
    attributes += this.nl + indent;
  }

  let str = this.nl + indent + attributes + comments;

  if (node.isAbstract) {
    str += 'abstract ';
  }
  if (node.isFinal) {
    str += 'final ';
  }

  if (node.isStatic) {
    str += 'static ';
  }
  // Fall back to public if nothing is specified
  if (!node.visibility) {
    node.visibility = 'public';
  }
  str += node.visibility + ' function ';
  if (node.byref) {
    str += '&';
  }
  str += node.name.name;

  str += args(node.arguments, indent, this);

  // php7 / return type
  if (node.type) {
    str += this.ws + ':' + this.ws;
    if (! node.type.types) {

      if (node.nullable) {
        str += '?';
      }
      str += identifier(node.type);
    } else {
      str += map.bind(this)(node.type.types || [], '', "|");
    }
  }

  // It lacks body. Must be an abstract method declaration.
  if (node.isAbstract || !node.body) {
    return str + (! String(str).startsWith('//') ? ';' : '');
  }

  if (this.options.bracketsNewLine) {
    str += this.nl + indent + '{' + this.nl;
  } else {
    str +=  this.ws + '{' + this.nl;
  }

  str += doBody.call(this, codegen, indent, (node.body.children || []).filter(i => i));
  //console.log('>>>>>>>>>>', str, node.body.children);
  str += indent + '}';
  return str;
};
