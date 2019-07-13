"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decimal_js_1 = require("decimal.js");
const IInsightFacade_1 = require("./IInsightFacade");
var Applytoken;
(function (Applytoken) {
    Applytoken["MAX"] = "MAX";
    Applytoken["MIN"] = "MIN";
    Applytoken["AVG"] = "AVG";
    Applytoken["COUNT"] = "COUNT";
    Applytoken["SUM"] = "SUM";
})(Applytoken = exports.Applytoken || (exports.Applytoken = {}));
class ApplyToken {
    constructor(at) {
        this.at = at;
    }
    applyOperation(group, field) {
        try {
            if (this.at === "MAX") {
                let numarray = this.getProperties(group, field);
                let result = numarray[0];
                for (let i in numarray) {
                    if (numarray[i] > result) {
                        result = numarray[i];
                    }
                }
                return result;
            }
            if (this.at === "MIN") {
                let numarray = this.getProperties(group, field);
                let result = numarray[0];
                for (let i in numarray) {
                    if (numarray[i] < result) {
                        result = numarray[i];
                    }
                }
                return result;
            }
            if (this.at === "AVG") {
                let numarray = this.getProperties(group, field);
                let total = new decimal_js_1.Decimal(0);
                for (let i in numarray) {
                    let dec = new decimal_js_1.Decimal(numarray[i]);
                    total = decimal_js_1.Decimal.add(dec, total);
                }
                let avg = total.toNumber() / numarray.length;
                let result = Number(avg.toFixed(2));
                return result;
            }
            if (this.at === "COUNT") {
                let result = 0;
                let compare = [];
                for (let obj of group) {
                    if (obj.hasOwnProperty(field.split("_")[1])) {
                        let flag = true;
                        let value = obj[field.split("_")[1]];
                        for (let i in compare) {
                            if (value === compare[i]) {
                                flag = false;
                            }
                        }
                        if (flag) {
                            compare.push(value);
                        }
                    }
                    else {
                        throw new IInsightFacade_1.InsightError("invalid key in apply");
                    }
                }
                return compare.length;
            }
            if (this.at === "SUM") {
                let numarray = this.getProperties(group, field);
                let sum = 0;
                for (let i in numarray) {
                    sum += numarray[i];
                }
                return Number(sum.toFixed(2));
            }
        }
        catch (e) {
            throw new IInsightFacade_1.InsightError(e);
        }
    }
    getProperties(inputarray, field) {
        let outputarray = [];
        for (let obj of inputarray) {
            if (field.split("_")[1] === "fullname" || field.split("_")[1] === "shortname" ||
                field.split("_")[1] === "number" || field.split("_")[1] === "name"
                || field.split("_")[1] === "address" || field.split("_")[1] === "type" ||
                field.split("_")[1] === "furniture" || field.split("_")[1] === "href" ||
                field.split("_")[1] === "uuid" || field.split("_")[1] === "title" ||
                field.split("_")[1] === "dept" || field.split("_")[1] === "id") {
                throw new IInsightFacade_1.InsightError("Not a valid number to applyToken");
            }
            if (!obj.hasOwnProperty(field.split("_")[1])) {
                throw new IInsightFacade_1.InsightError("Invalid key in apply");
            }
            outputarray.push(obj[field.split("_")[1]]);
        }
        return outputarray;
    }
}
exports.ApplyToken = ApplyToken;
//# sourceMappingURL=ApplyToken.js.map