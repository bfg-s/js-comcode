/*jslint node: true, indent: 2 */
'use strict';

const params = require("./helper/parameters");
const map = require("./helper/map");

module.exports = function (node, indent) {
  let codegen = this.process.bind(this);
  let comments = "";

  if (node.leadingComments) {
    comments = map.bind(this)(node.leadingComments || [], '', "\n");
    //comments += this.nl;
  }

  if (! node.expression.what && node.expression.left.kind === 'variable') {
    return comments + `${codegen(node.expression.left, indent)} ${node.expression.operator} ` + (node.expression.right ? codegen(node.expression.right, indent) : '') +
        (node.expression.right.arguments ? '(' + params(node.expression.right.arguments, indent, this) + ')' : '');
  }
  if (node.expression.kind === 'assign') {
    return  comments + codegen(node.expression.left, indent) + ` ${node.expression.operator} ` + codegen(node.expression.right, indent);
  }

  return comments + (node.expression.what ? codegen(node.expression.what, indent) : '') +
      (! node.expression.what.isAnonymous ? '(' + (node.expression.arguments ? params(node.expression.arguments, indent, this) : '') + ')' : '');
};
