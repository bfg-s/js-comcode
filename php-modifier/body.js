const Engine = require("./engine");

module.exports = class Body extends Engine {

    constructor(ast, root) {
        super();
        this.ast = ast;
        this.root = root;
    }

    deleteZone (zone = 'code') {
        let startIndex = -1, endIndex = -1;
        let endTrailing = false;

        this.ast.forEach((node, i) => {
            if (node.leadingComments) {
                node.leadingComments.forEach(comment => {
                    if (comment.value.includes(`Start ${zone}`)) {
                        startIndex = i;
                    }
                });
            }
            if (node.trailingComments) {
                node.trailingComments.forEach(comment => {
                    if (comment.value.includes(`End ${zone}`)) {
                        endIndex = i;
                        endTrailing = true;
                    }
                });
            }
            if (node.leadingComments) {
                node.leadingComments.forEach(comment => {
                    if (comment.value.includes(`End ${zone}`)) {
                        endIndex = i;
                    }
                });
            }
        });

        if (startIndex === -1 || endIndex === -1) {
            //
        } else if (startIndex === endIndex) {
            this.ast = this.ast.filter((i,k) => k !== startIndex);
        } else {
            this.ast[endIndex].leadingComments = [];
            this.ast[endIndex].trailingComments = [];
            this.ast.splice(startIndex, endIndex - (! endTrailing ? startIndex : startIndex-1));
        }
    }

    zone(codeToInsert, zone = 'code') {
        let newCodeAst = this.__codeToAst(codeToInsert).children;
        let startIndex = -1, endIndex = -1;
        let endTrailing = false;

        this.ast.forEach((node, i) => {
            if (node.leadingComments) {
                node.leadingComments.forEach(comment => {
                    if (comment.value.includes(`Start ${zone}`)) {
                        startIndex = i;
                    }
                });
            }
            if (node.trailingComments) {
                node.trailingComments.forEach(comment => {
                    if (comment.value.includes(`End ${zone}`)) {
                        endIndex = i;
                        endTrailing = true;
                    }
                });
            }
            if (node.leadingComments) {
                node.leadingComments.forEach(comment => {
                    if (comment.value.includes(`End ${zone}`)) {
                        endIndex = i;
                    }
                });
            }
        });

        const startZone = this.__codeToAst(`/** Start ${zone} **/`).children[0].leadingComments;
        const endZone = this.__codeToAst(`/** End ${zone} **/`).children[0].leadingComments;

        if (startIndex === -1 || endIndex === -1) {
            this.ast.push(...startZone, ...newCodeAst, ...endZone);
        } else if (startIndex === endIndex) {
            newCodeAst[0].leadingComments = startZone;
            this.ast.splice(startIndex, 1, ...newCodeAst, ...endZone);
        } else {
            newCodeAst[0].leadingComments = startZone;
            this.ast.splice(startIndex, endIndex - (! endTrailing ? startIndex : startIndex-1));
            this.ast.splice(startIndex, 0, ...newCodeAst, ...(! endTrailing ? [] : endZone));
        }
    }
}
