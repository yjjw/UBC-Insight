
import {Decimal} from "decimal.js";
import {InsightError} from "./IInsightFacade";

export enum Applytoken {
    MAX = "MAX",
    MIN = "MIN",
    AVG = "AVG",
    COUNT = "COUNT",
    SUM = "SUM",
}
export class ApplyToken {
    private at: Applytoken;
    // private ikey: string;
    // private id: string;
    constructor(at: Applytoken) {
        this.at = at;
    }
    public applyOperation(group: any[], field: string): number {
        try {
            if (this.at === "MAX") {
                let numarray: number[] = this.getProperties(group, field);
                // return Math.max.apply(numarray); // .apply flattens the numarray, convert number[] to number
                let result = numarray[0];
                for (let i in numarray) {
                    if (numarray[i] > result) {
                        result = numarray[i];
                    }
                }
                return result;
            }
            if (this.at === "MIN") {
                let numarray: number[] = this.getProperties(group, field);
                // global.console.log(numarray);
                let result = numarray[0];
                for (let i in numarray) {
                    if (numarray[i] < result) {
                        result = numarray[i];
                    }
                }
                return result;
            }
            if (this.at === "AVG") {
                let numarray: number[] = this.getProperties(group, field);
                let total = new Decimal(0);
                for (let i in numarray) {
                    let dec = new Decimal(numarray[i]);
                    total = Decimal.add(dec, total);
                }
                let avg = total.toNumber() / numarray.length;
                let result = Number(avg.toFixed(2));
                return result;
            }
            if (this.at === "COUNT") {
                let result = 0;
                let compare: any[] = []; // store unique values
                for (let obj of group) {
                    if (obj.hasOwnProperty(field.split("_")[1])) {
                        // value can be string or number
                        let flag: boolean = true;
                        let value = obj[field.split("_")[1]];
                        for (let i in compare) {
                            if (value === compare[i]) {
                                flag = false;
                            }
                        }
                        if (flag) {
                            compare.push(value);
                        }
                    } else {
                        throw new InsightError("invalid key in apply");
                    }
                }
                return compare.length;
            }
            if (this.at === "SUM") {
                let numarray: number[] = this.getProperties(group, field);
                let sum = 0;
                for (let i in numarray) {
                    sum += numarray[i];
                }
                return Number(sum.toFixed(2));
            }
        } catch (e) {
            throw new InsightError(e);
        }
    }
    // get the array of numeric values of a property in inputarray
    public getProperties (inputarray: any[], field: string): number[] {
        let outputarray: number[] = [];
        for (let obj of inputarray) {
            if (field.split("_")[1] === "fullname" || field.split("_")[1] === "shortname" ||
                field.split("_")[1] === "number" || field.split("_")[1] === "name"
                || field.split("_")[1] === "address" || field.split("_")[1] === "type" ||
                field.split("_")[1] === "furniture" || field.split("_")[1] === "href" ||
                field.split("_")[1] === "uuid" || field.split("_")[1] === "title" ||
                field.split("_")[1] === "dept" || field.split("_")[1] === "id") {
                throw new InsightError("Not a valid number to applyToken");
            }
            if (!obj.hasOwnProperty(field.split("_")[1])) {
                throw new InsightError("Invalid key in apply");
            }
            outputarray.push(obj[field.split("_")[1]]);
        }
        return outputarray;
    }
}
