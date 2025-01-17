/*jslint node: true, indent: 2 */
'use strict';

const map = require("./helper/map");
/**
 * Constant declaration
 */
module.exports = function (node, indent) {
  let str = '';
  //let codegen = this.process.bind(this);
  let attributes = map.bind(this)(node.attrGroups || [], '', "\n");
  if (node.visibility) {
    str += node.visibility + ' ';
  }
  str += 'const ';
  //str += node.name;
  if (node.constants.length) {
    //str += this.ws + '=' + this.ws;
    //str += codegen(node.value, indent);
    str += map.bind(this)(node.constants || [], '', ", ");
  }
  return attributes + this.nl + indent + str;
};
