/*jslint node: true, indent: 2 */
'use strict';

const map = require("./helper/map");
module.exports = function (node, indent) {
  let comments = "";

  if (node.leadingComments) {
    comments = map.bind(this)(node.leadingComments || [], '', "\n");
    comments += this.nl;
  }

  let str = comments + indent + '#[';
  str += map.bind(this)(node.attrs || [], indent, ", ");
  return str + ']';
};
