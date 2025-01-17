/*jslint node: true, indent: 2 */
'use strict';

const args = require("./helper/arguments");
const identifier = require("./helper/identifier");
const doBody = require("./helper/body");
const map = require("./helper/map");
module.exports = function (node, indent) {
  let codegen, str;
  codegen = this.process.bind(this);

  str = 'fn ';
  if (node.byref) {
    str += '&';
  }
  str += args(node.arguments, indent, this);

  // php7 / return type
  if (node.type) {
    str += this.ws + ':' + this.ws;
    if (node.nullable) {
      str += '?';
    }
    str += identifier(node.type);
  }

  str += this.ws + ' => ';

  if (node.body.items) {
    str += '[' + map.bind(this)(node.body.items || [], indent, ",") + ']';
  } else {
    str += codegen(node.body, indent);
  }
  str += indent + '' + this.nl;

  return str;
};
