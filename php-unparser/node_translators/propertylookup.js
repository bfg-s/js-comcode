/*jslint node: true, indent: 2 */
'use strict';

module.exports = function (node, indent, delimiter = '->') {
  let codegen, prop;
  codegen = this.process.bind(this);
  prop = (function () {
    let child = node.offset;

    if (child.kind === 'constref') {
      return child.name;
    }
    if (child.kind === 'variable' || child.kind === 'identifier') {
      return codegen(child, indent);
    }
    return '{' + codegen(child, indent) + '}';
  }());

  return codegen(node.what, indent) + delimiter + prop;
};
