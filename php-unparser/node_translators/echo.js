/*jslint node: true, indent: 2 */
'use strict';

let params = require('./helper/parameters');
const map = require("./helper/map");

module.exports = function (node, indent) {
  let str = map.bind(this)(node.expressions || [], indent, ",");
  //let str = params(node.arguments, indent, this);

  if (node.isInlineEcho) {
    return str + this.ws + '?>';
  }
  //console.log(node);
  return 'echo ' + str;
};
