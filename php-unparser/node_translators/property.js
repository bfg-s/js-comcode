/*jslint node: true, indent: 2 */
'use strict';

module.exports = function property(node, indent) {
  let codegen, str = '';
  codegen = this.process.bind(this);
  //console.log(node);
  if (node.isFinal) {
    str += 'final ';
  }
  if (node.isStatic) {
    str += 'static ';
  }
  //str += node.visibility;
  if (node.readonly) {
    str += ' readonly';
  }
  if (node.type) {
    str += ' ' + (node.nullable ? '?':'') + codegen(node.type, indent);
  }
  str += ' $' + node.name.name;
  if (node.value) {

    str += ' = ' + codegen(node.value, indent);
  }
  return str;
};
