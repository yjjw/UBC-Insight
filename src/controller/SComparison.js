"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IDataSet_1 = require("./IDataSet");
const key_1 = require("./key");
const IInsightFacade_1 = require("./IInsightFacade");
class SComparison {
    constructor(key1, cvalue) {
        this.key = key1;
        this.cvalue = cvalue;
    }
    parseS(value) {
        let result = new IDataSet_1.IDataSet();
        try {
            if (value.ikind === IInsightFacade_1.InsightDatasetKind.Courses) {
                for (let fragment of value.ielements) {
                    switch (this.key) {
                        case key_1.key.subject: {
                            if (SComparison.checkAster(fragment.gisubject, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.id: {
                            if (SComparison.checkAster(fragment.giid, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.course: {
                            if (SComparison.checkAster(fragment.gicourse, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.prof: {
                            if (SComparison.checkAster(fragment.giprofessor, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.title: {
                            if (SComparison.checkAster(fragment.gititle, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        default: {
                            throw new IInsightFacade_1.InsightError("invalid key");
                        }
                    }
                }
            }
            if (value.ikind === IInsightFacade_1.InsightDatasetKind.Rooms) {
                result.setkind = IInsightFacade_1.InsightDatasetKind.Rooms;
                for (let fragment of value.ielements) {
                    switch (this.key) {
                        case key_1.key.fullname: {
                            if (SComparison.checkAster(fragment.gifullname, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.shortname: {
                            if (SComparison.checkAster(fragment.gishortname, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.name: {
                            if (SComparison.checkAster(fragment.giname, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.number: {
                            if (SComparison.checkAster(fragment.ginumber, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.address: {
                            if (SComparison.checkAster(fragment.giaddress, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.type: {
                            if (SComparison.checkAster(fragment.gitype, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.furniture: {
                            if (SComparison.checkAster(fragment.gifurniture, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key_1.key.href: {
                            if (SComparison.checkAster(fragment.gihref, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        default: {
                            throw new IInsightFacade_1.InsightError("invalid key");
                        }
                    }
                }
            }
        }
        catch (e) {
            throw new IInsightFacade_1.InsightError(e);
        }
        return result;
    }
    static checkAster(fragmentStr, cvalue) {
        if (cvalue.startsWith("*") && cvalue.endsWith("*") && cvalue.length > 2 &&
            !(cvalue.substring(1, cvalue.length - 1).includes("*"))) {
            return fragmentStr.includes(cvalue.substring(1, cvalue.length - 1));
        }
        if (cvalue.startsWith("*") && cvalue.length > 1 && (!cvalue.substring(1, cvalue.length).includes("*"))) {
            return fragmentStr.endsWith(cvalue.substring(1, cvalue.length));
        }
        if (cvalue.endsWith("*") && cvalue.length > 1 && (!cvalue.substring(0, cvalue.length - 1).includes("*"))) {
            return fragmentStr.startsWith(cvalue.substring(0, cvalue.length - 1));
        }
        if (cvalue.startsWith("*") && cvalue.length === 1) {
            return true;
        }
        if (!cvalue.includes("*")) {
            return fragmentStr === cvalue;
        }
        throw new IInsightFacade_1.InsightError("Invalid input string");
    }
}
exports.SComparison = SComparison;
//# sourceMappingURL=SComparison.js.map