/*jslint node: true, indent: 2 */
'use strict';

let doBody = require('./helper/body');
const map = require("./helper/map");

module.exports = function (node, indent) {
  let codegen, str, that;
  codegen = this.process.bind(this);

  let attributes = map.bind(this)(node.attrGroups || [], '', "\n");

  let comments = "";

  if (node.leadingComments) {
    comments = map.bind(this)(node.leadingComments || [], '', "\n");
    comments += this.nl + indent;
  }

  str = this.nl + indent;
  that = this;

  if (attributes) {
    str += attributes + "\n";
  }
  if (comments) {
    str += comments;
  }

  // Start
  if (node.isAnonymous) {
    str += 'return new ';
  } else if (node.isAbstract) {
    str += 'abstract ';
  } else if (node.isFinal) {
    str += 'final ';
  }

  str += 'class';
  if (! node.isAnonymous && node.name.name) {
    str += ' ' + node.name.name;
  }

  if (node.extends) {
    str += ' extends ' + codegen(node.extends, indent);
  }

  if (node.implements) {
    str += ' implements ' + node.implements.map(function (x) {
      return codegen(x, indent);
    }).join(',' + that.ws);
  }

  // begin curly brace
  if (node.name) {
    if (this.options.bracketsNewLine) {
      str += this.nl + indent + '{' + this.nl;
    } else {
      str += this.ws + '{' + this.nl;
    }
  } else {
    str += this.ws + '{' + this.nl;
  }


  // class body
  str += doBody.call(this, codegen, indent, node.body);

  // end curly brace
  str += indent + '}';
  if (node.isAnonymous) {
    str += ';';
  }
  if (node.name) {
    str += this.nl;
  }

  return str;
};
