/*jslint node: true, indent: 2 */
'use strict';

let doBody = require('./helper/body');

module.exports = function (node, indent) {
  let str, codegen;
  codegen = this.process.bind(this);

  if (node.withBrackets) {
    str = 'namespace ' + node.name + this.ws + '\n{\n\n';
    str += doBody.call(this, codegen, indent, node.children);
    str += '}';
  } else {
    str = 'namespace ' + node.name + ';\n\n';
    str += doBody.call(this, codegen, '', node.children);
  }

  return str;
};
