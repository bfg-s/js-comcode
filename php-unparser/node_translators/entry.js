/*jslint node: true, indent: 2 */
'use strict';

module.exports = function (node, indent) {
  let codegen = this.process.bind(this);
  //console.error('>>>>>>>', node);
  let str = codegen(node.key);
  let str2 = codegen(node.value);

  return str + ' => ' + str2;
};
