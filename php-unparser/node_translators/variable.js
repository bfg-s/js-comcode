/*jslint node: true, indent: 2 */
'use strict';

module.exports = function (node, indent) {
  if (typeof node.name !== 'string') {
    let codegen = this.process.bind(this);
    node.name = codegen(node.name, indent);
  }
  return (node.byref ? '&$' : '$') + node.name;
};
