/*jslint node: true, indent: 2 */
'use strict';

/**
 * Usage declaration
 */
module.exports = function (node, indent) {
  let str = 'use' + this.ws, items, glue;
  if (node.type) {
    str += node.type + this.ws;
  }

  items = (node.items || []).map(function (item) {
    let useItem = item.name;
    if (item.alias) {
      useItem += ' as ' + item.alias.name;
    }
    return useItem;
  });

  if (node.items.length > 1) {
    glue = this.nl +  indent + this.indent;
    str += node.name + this.ws + '{' + glue;
    str += items.join(',' + glue) + this.nl;
    str += indent + '};';
  } else {
    str += items[0] + ';';
  }
  return str;
};
