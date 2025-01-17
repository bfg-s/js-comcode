/*jslint node: true, indent: 2 */
'use strict';

let CodeGen = require('./node_translators');

module.exports = function (ast, opts) {
  opts = opts || {};
  let codeGen = new CodeGen(opts);

  return codeGen.process(ast, '');
};
