"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("./IInsightFacade");
class IDataSet {
    set iid(value) {
        this.id = value;
    }
    get iid() {
        return this.id;
    }
    get ielements() {
        return this.elements;
    }
    set pushelements(element) {
        this.elements.push(element);
    }
    get ikind() {
        return this.kind;
    }
    set setkind(ikind) {
        this.kind = ikind;
    }
    constructor() {
        this.elements = [];
        this.id = "";
        this.kind = IInsightFacade_1.InsightDatasetKind.Courses;
    }
    getLengthElements() {
        return this.elements.length;
    }
}
exports.IDataSet = IDataSet;
//# sourceMappingURL=IDataSet.js.map