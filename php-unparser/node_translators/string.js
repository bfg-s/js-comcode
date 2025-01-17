/*jslint node: true, indent: 2, unparam:true */
'use strict';

module.exports = function (node, indent, opt) {
  opt = opt || {};
  if (opt.raw) {
    return node.value.replace(/\\/g, '\\\\');
  }
  return JSON.stringify(node.value).replace(/\$/g, '\\$').replace(/\\/g, '\\\\');
};
