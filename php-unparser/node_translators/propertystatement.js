/*jslint node: true, indent: 2 */
'use strict';

const map = require("./helper/map");

module.exports = function (node, indent) {
  let codegen, str = [];
  codegen = this.process.bind(this);

  let comments = "";

  if (node.leadingComments) {
    comments = map.bind(this)(node.leadingComments || [], '', "\n");

    //comments += this.nl + indent;
  }
  //console.log(comments);
  let attributes = "";

  for (let i = 0; i < node.properties.length; i++) {
    const attrGroups = node.properties[i].attrGroups || [];
    attributes += map.bind(this)(attrGroups, indent, "\n");
  }

  if (attributes) {
    attributes += this.nl + indent;
  }

  for (let i = 0; i < node.properties.length; i++) {
    str.push(codegen(node.properties[i], indent));
  }

  return this.nl + indent + attributes + comments + node.visibility + str.join(',');
};
