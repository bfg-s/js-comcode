/*jslint node: true, indent: 2 */
'use strict';

module.exports = function (node, indent) {
  let codegen = this.process.bind(this);
  return '...' + codegen(node.what, indent);
};
