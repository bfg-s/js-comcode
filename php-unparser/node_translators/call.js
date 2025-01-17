/*jslint node: true, indent: 2 */
'use strict';

let params = require('./helper/parameters');

module.exports = function (node, indent) {
  let codegen = this.process.bind(this);
  return codegen(node.what, indent) +
    '(' + params(node.arguments, indent, this) + ')';
};
