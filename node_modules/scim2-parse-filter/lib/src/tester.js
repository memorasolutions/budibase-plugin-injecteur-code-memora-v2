"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tester = void 0;
class Tester {
    constructor() { }
    test(r, f) {
        switch (f.op) {
            case "or":
                return f.filters.some(c => this.test(r, c));
            case "and":
                return f.filters.every(c => this.test(r, c));
            case "not":
                return !this.test(r, f.filter);
            case "[]":
                return this.attrTest(this.attrPath(f.attrPath), r, s => this.test(s, f.valFilter));
            case "pr":
                return this.attrTest(this.attrPath(f.attrPath), r, s => this[f.op](s));
            case "eq":
            case "ne":
            case "co":
            case "sw":
            case "ew":
            case "gt":
            case "lt":
            case "ge":
            case "le":
                return this.attrTest(this.attrPath(f.attrPath), r, s => this[f.op](s, f.compValue));
        }
    }
    attrPath(path) {
        const i = path.lastIndexOf(":");
        if (i === -1) {
            return path.split(".");
        }
        return [path.substring(0, i), ...path.substring(i + 1).split(".")];
    }
    attrTest(path, r, op) {
        if (path.length === 0) {
            return op(r);
        }
        if (typeof r !== "object" || r === null) {
            return false;
        }
        if (Array.isArray(r)) {
            return r.some(i => this.attrTest(path, i, op));
        }
        const p = path[0].toLowerCase();
        const key = Object.keys(r).find(k => k.toLowerCase() === p);
        if (key === undefined) {
            return false;
        }
        return this.attrTest(path.slice(1), r[key], op);
    }
    pr(r, _) {
        return r !== undefined;
    }
    eq(r, v) {
        return r === v;
    }
    ne(r, v) {
        return r !== v;
    }
    gt(r, v) {
        return v !== null && r > v;
    }
    lt(r, v) {
        return v !== null && r < v;
    }
    le(r, v) {
        return v !== null && r <= v;
    }
    ge(r, v) {
        return v !== null && r >= v;
    }
    sw(r, v) {
        return v !== null && r !== null && r.toString().startsWith(v.toString());
    }
    ew(r, v) {
        return v !== null && r !== null && r.toString().endsWith(v.toString());
    }
    // The entire operator value must be a substring of the attribute value for a match.
    co(r, v) {
        if (typeof r === "object" || v === null) {
            return r == v;
        }
        if (typeof r !== "string") {
            r = r.toString();
        }
        return r.indexOf(v.toString()) !== -1;
    }
}
exports.Tester = Tester;
Tester.UNDEF = Symbol("undefined");
//# sourceMappingURL=tester.js.map