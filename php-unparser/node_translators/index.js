/*jslint node: true, indent: 2, nomen:true, evil: true */
'use strict';

const map = require("./helper/map");
let defaults = {
  indent: '    ',
  dontUseWhitespaces: false,
  shortArray: false,
  bracketsNewLine: true,
  forceNamespaceBrackets: false,
  collapseEmptyLines: true
};

function CodeGen(options) {

  // Get options
  this.options = Object.assign({}, defaults, options);
  this.ws = this.options.dontUseWhitespaces ? '' : ' ';
  this.indent = typeof this.options.indent === 'string' ? this.options.indent : '    ';
  this.nl = this.indent !== '' ? '\n' : '';
  this.shortArray = this.options.shortArray || false;
  this.forceNamespaceBrackets = this.options.forceNamespaceBrackets || false;

  this.process = function (node, indent) {
    let err;

    if (node === null) {
      return indent;
    }

    if (node && node.kind) {
      if (typeof this[node.kind] === 'function') {

        let comments = "";
        let commentsEnd = "";

        if (
            node.leadingComments
            && hasComments(node.kind)
        ) {
          comments = map.bind(this)(node.leadingComments || [], indent, "\n");
        }

        if (
            node.trailingComments
            && hasComments(node.kind)
        ) {
          commentsEnd = map.bind(this)(node.trailingComments || [], indent, "\n");
          commentsEnd = this.nl + commentsEnd;
        }

        return comments + this[node.kind](node, indent) + commentsEnd;
      }
      //console.log(node);
      err = new Error(
        'Unhandled node type [' + node.kind + ']' + (
          node.loc ? ' at line ' + node.loc.start.line : ''
        )
      );
    } else {
      console.error('Node:', node);
      if (node) console.log('Node kind:', node.kind);
      err = new Error('Bad AST structure');
    }
    err.node = node;
    throw err;
  };

  function hasComments (kind) {
    return kind !== 'expressionstatement'
        && kind !== 'attrgroup'
        && kind !== 'class'
        && kind !== 'method'
        && kind !== 'propertystatement'
        && kind !== 'noop';
  }
}

module.exports = CodeGen;

// node translators
CodeGen.prototype.entry = require("./entry.js");
CodeGen.prototype.arrowfunc = require("./arrowfunc.js");
CodeGen.prototype.commentline = require("./commentline.js");
CodeGen.prototype.parentreference = require("./parentreference.js");
CodeGen.prototype.staticreference = require("./staticreference.js");
CodeGen.prototype.noop = require("./noop.js");
CodeGen.prototype.array = require("./array.js");
CodeGen.prototype.assign = require("./assign.js");
CodeGen.prototype.bin = require("./bin.js");
CodeGen.prototype.block = require("./block.js");
CodeGen.prototype.boolean = require("./boolean.js");
CodeGen.prototype.break = require("./break.js");
CodeGen.prototype.call = require("./call.js");
CodeGen.prototype.cast = require("./cast.js");
CodeGen.prototype.classconstant = require("./classconstant.js");
CodeGen.prototype.class = require("./class.js");
CodeGen.prototype.clone = require("./clone.js");
CodeGen.prototype.closure = require("./closure.js");
CodeGen.prototype.constant = require("./constant.js");
CodeGen.prototype.constref = require("./constref.js");
CodeGen.prototype.continue = require("./continue.js");
CodeGen.prototype.declare = require("./declare.js");
CodeGen.prototype.doc = require("./doc.js");
CodeGen.prototype.do = require("./do.js");
CodeGen.prototype.echo = require("./echo.js");
CodeGen.prototype.empty = require("./empty.js");
CodeGen.prototype.encapsed = require("./encapsed.js");
CodeGen.prototype.eval = require("./eval.js");
CodeGen.prototype.exit = require("./exit.js");
CodeGen.prototype.foreach = require("./foreach.js");
CodeGen.prototype.for = require("./for.js");
CodeGen.prototype.function = require("./function.js");
CodeGen.prototype.global = require("./global.js");
CodeGen.prototype.goto = require("./goto.js");
CodeGen.prototype.identifier = require("./identifier.js");
CodeGen.prototype.if = require("./if.js");
CodeGen.prototype.include = require("./include.js");
CodeGen.prototype.inline = require("./inline.js");
CodeGen.prototype.interface = require("./interface.js");
CodeGen.prototype.isset = require("./isset.js");
CodeGen.prototype.label = require("./label.js");
CodeGen.prototype.list = require("./list.js");
CodeGen.prototype.magic = require("./magic.js");
CodeGen.prototype.method = require("./method.js");
CodeGen.prototype.name = require("./name.js");
CodeGen.prototype.namespace = require("./namespace.js");
CodeGen.prototype.new = require("./new.js");
CodeGen.prototype.nowdoc = require("./nowdoc.js");
CodeGen.prototype.number = require("./number.js");
CodeGen.prototype.offsetlookup = require("./offsetlookup.js");
CodeGen.prototype.parenthesis = require("./parenthesis.js");
CodeGen.prototype.post = require("./post.js");
CodeGen.prototype.pre = require("./pre.js");
CodeGen.prototype.print = require("./print.js");
CodeGen.prototype.program = require("./program.js");
CodeGen.prototype.property = require("./property.js");
CodeGen.prototype.propertylookup = require("./propertylookup.js");
CodeGen.prototype.propertystatement = require("./propertystatement.js");
CodeGen.prototype.expressionstatement = require("./expressionstatement.js");
CodeGen.prototype.nullsafepropertylookup = require("./nullsafepropertylookup.js");
CodeGen.prototype.uniontype = require("./uniontype.js");
CodeGen.prototype.nullkeyword = require("./nullkeyword.js");
CodeGen.prototype.namedargument = require("./namedargument.js");
CodeGen.prototype.commentblock = require("./commentblock.js");
CodeGen.prototype.attrgroup = require("./attrgroup.js");
CodeGen.prototype.attribute = require("./attribute.js");
CodeGen.prototype.retif = require("./retif.js");
CodeGen.prototype.return = require("./return.js");
CodeGen.prototype.silent = require("./silent.js");
CodeGen.prototype.static = require("./static.js");
CodeGen.prototype.staticlookup = require("./staticlookup.js");
CodeGen.prototype.string = require("./string.js");
CodeGen.prototype.switch = require("./switch.js");
CodeGen.prototype.throw = require("./throw.js");
CodeGen.prototype.trait = require("./trait.js");
CodeGen.prototype.traituse = require("./traituse.js");
CodeGen.prototype.try = require("./try.js");
CodeGen.prototype.typereference = require("./typereference.js");
CodeGen.prototype.unary = require("./unary.js");
CodeGen.prototype.unset = require("./unset.js");
CodeGen.prototype.usegroup = require("./usegroup.js");
CodeGen.prototype.variable = require("./variable.js");
CodeGen.prototype.variadic = require("./variadic.js");
CodeGen.prototype.while = require("./while.js");
CodeGen.prototype.yieldfrom = require("./yieldfrom.js");
CodeGen.prototype.yield = require("./yield.js");
CodeGen.prototype.encapsedpart = require("./encapsedpart.js");
