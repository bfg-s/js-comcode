/*jslint node: true, indent: 2 */
'use strict';

const map = require("./helper/map");
module.exports = function (node, indent) {
  //let codegen, str;
  //codegen = this.process.bind(this);

  let str = map.bind(this)(node.leadingComments || [], indent, "\n");

  //str = codegen(node.leadingComments, indent);

  return str;
};
