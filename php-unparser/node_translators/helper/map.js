module.exports = function (arrayList, ident, delimiter = "") {
    let codegen = this.process.bind(this);
    let str = [];
    for (let i = 0; i < arrayList.length; i++) {
        str.push(codegen(arrayList[i], ident));
    }
    return str.join(delimiter);
}
