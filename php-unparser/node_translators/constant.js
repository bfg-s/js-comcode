/*jslint node: true, indent: 2 */
'use strict';

/**
 * Constant declaration
 */
module.exports = function (node, indent) {
  let codegen, str;
  codegen = this.process.bind(this);

  // a namespace constant (name, value)
  str = '';
  str += node.name.name;
  str += this.ws + '=' + this.ws;
  str += codegen(node.value, indent);

  return str;
};
