"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IQuery {
    set ifilter(value) {
        this.fiter = value;
    }
    set ibody(value) {
        this.body = value;
    }
    set ioptions(value) {
        this.options = value;
    }
    set inegation(value) {
        this.negation = value;
    }
    set iscomparison(value) {
        this.scomparison = value;
    }
    set imcomparison(value) {
        this.mcomparison = value;
    }
    set ilogiccomparison(value) {
        this.logiccomparison = value;
    }
    constructor() {
        this.logiccomparison = "";
        this.mcomparison = "";
        this.scomparison = "";
        this.negation = "";
        this.fiter = "";
        this.body = "";
        this.options = "";
    }
}
exports.IQuery = IQuery;
//# sourceMappingURL=IQuery.js.map