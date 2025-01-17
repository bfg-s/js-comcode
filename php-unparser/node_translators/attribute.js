/*jslint node: true, indent: 2 */
'use strict';

const map = require("./helper/map");

module.exports = function (node, indent) {

  let args = map.bind(this)(node.args || [], '', ", ");
  return node.name + '(' + args + ')';
};
