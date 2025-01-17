/*jslint node: true, indent: 2, unparam:true */
'use strict';

module.exports = function (node, indent, opt) {

  let body = '', codegen = this.process.bind(this);

  node.value.forEach(function (item) {

    if (item.expression.kind === 'string') {
      body += item.expression.value.replace(/\\/g, '\\\\');
    } else {
      if (item.syntax === 'complex') {

        body += '{' + codegen(item, indent) + '}';
      } else {
        body += codegen(item, indent);
      }
    }
  });

  if (node.type === 'heredoc') {
    return '<<<' + node.label + this.nl + body + node.label;
  }

  if (node.type === 'nowdoc') {
    return '<<<\'' + node.label + '\'' + this.nl + body + node.label;
  }

  if (node.type === 'shell') {
    return '`' + body + '`';
  }

  if (node.isDoubleQuote) {
    return '"' + body + '"';
  }

  return '"' + body + '"';
};
