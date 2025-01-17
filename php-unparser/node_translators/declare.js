/*jslint node: true, indent: 2 */
'use strict';

let doBody = require('./helper/body');

module.exports = function (node, indent) {
  let codegen, str, items = [], k;
  codegen = this.process.bind(this);
  for (k in node.what) {
    if (node.what.hasOwnProperty(k) && node.what[k]) {
      items.push(k + this.ws + '=' + this.ws + codegen(node.what[k]));
    }
  }
  str = 'declare(' + items.join(',' + this.ws) + ')';
  if (node.mode !== 'none') {
    str += this.ws + '{' + this.nl;
    str += doBody.call(this, codegen, indent, node.children);
    str += indent + '}' + this.nl;
  } else {
    str += ';' + this.nl;
    str += doBody.call(this, codegen, indent, node.children, true);
  }
  return str;
};
