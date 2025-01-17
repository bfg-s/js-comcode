/*jslint node: true, indent: 2 */
'use strict';

module.exports = function (node, indent) {

  let codegen = this.process.bind(this);
  let str = [];

  for (let i = 0; i < node.types.length; i++) {
    str.push(codegen(node.types[i], indent));
  }

  return str.join('|');
};
