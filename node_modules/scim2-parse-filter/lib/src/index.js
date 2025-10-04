"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = exports.parse = exports.filter = exports.Tester = exports.stringify = void 0;
const toknizer = require("./parser");
const tester = require("./tester");
const fl = require("./flatten");
var stringify_1 = require("./stringify");
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return stringify_1.stringify; } });
exports.Tester = tester.Tester;
function filter(filter) {
    const tester = new exports.Tester();
    return (r) => tester.test(r, filter);
}
exports.filter = filter;
function parse(query) {
    const l = new toknizer.Tokens(toknizer.tokenizer(query));
    const filter = toknizer.parseFilter(l);
    if (l.peek().type !== "EOT") {
        throw new Error(`unexpected EOT ${l.getList()}`);
    }
    return filter;
}
exports.parse = parse;
function flatten(f) {
    return fl.log(fl.valfilter(f));
}
exports.flatten = flatten;
//# sourceMappingURL=index.js.map