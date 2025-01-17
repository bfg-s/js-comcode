/*jslint node: true, indent: 2 */
'use strict';

function getFlagName (flag) {
  if (flag === 1) {
    return 'public ';
  } else if (flag === 2) {
    return 'protected ';
  } else if (flag === 4) {
    return 'private ';
  }
  return '';
}

// name, type, value, isRef, isVariadic
function processElement(indent, ws, codegen) {
  return function (arg) {
    let str = getFlagName(arg.flags);

    if (arg.nullable) {
      str += '?';
    }

    if (arg.type) { // type hint
      str += codegen(arg.type, indent) + ws;
    }

    if (arg.byref) { // byref
      str += '&';
    }

    if (arg.variadic) { // variadic
      str += '...';
    }

    str += '$' + arg.name.name; // name

    if (arg.value) { // default value
      str += ws + '=' + ws + codegen(arg.value, indent);
    }

    return str;
  };
}

module.exports = function (nodes, indent, self) {
  let codegen, args, space, listArgs;

  codegen = self.process.bind(self);
  args = nodes.map(processElement(indent, self.ws, codegen));
  listArgs = args.join(',' + self.ws);

  if (listArgs.length > 80) {
    space = self.nl + indent + self.indent;
    args = nodes.map(processElement(indent + self.indent, self.ws, codegen));
    listArgs = space + args.join(',' + space) + self.nl + indent;
  }

  return '(' + listArgs + ')';
};
