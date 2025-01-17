/*jslint node: true, indent: 2 */
'use strict';

module.exports = function (node, indent) {
  return require('./propertylookup').bind(this)(node, indent, '?->');
};
