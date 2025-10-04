"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.valfilter = void 0;
const valfilter = (f, path) => {
    if (path && "attrPath" in f) {
        f = Object.assign(Object.assign({}, f), { attrPath: `${path}.${f.attrPath}` });
    }
    switch (f.op) {
        case "and":
        case "or":
            return Object.assign(Object.assign({}, f), { filters: f.filters.map(c => (0, exports.valfilter)(c, path)) });
        case "not":
            return Object.assign(Object.assign({}, f), { filter: (0, exports.valfilter)(f, path) });
        case "[]":
            return (0, exports.valfilter)(f.valFilter, f.attrPath);
    }
    return f;
};
exports.valfilter = valfilter;
// 1 and 2 or (1 or b) => 1 and 2 or 1 or b
const log = (f) => {
    switch (f.op) {
        case "and":
        case "or":
            const filters = f.filters.map(exports.log);
            const result = [];
            filters.forEach(c => {
                if (c.op == f.op) {
                    c.filters.forEach(cc => result.push(cc));
                }
                else {
                    result.push(c);
                }
            });
            return Object.assign(Object.assign({}, f), { filters: result });
    }
    return f;
};
exports.log = log;
//# sourceMappingURL=flatten.js.map