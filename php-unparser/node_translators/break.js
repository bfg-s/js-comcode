/*jslint node: true, indent: 2 */
'use strict';

module.exports = function (node, indent) {
  if (node.level) {
    let codegen = this.process.bind(this);
    return 'break ' + codegen(node.level, indent);
  }
  return 'break';
};
