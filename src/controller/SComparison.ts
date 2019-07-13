import {IDataSet} from "./IDataSet";
import {key} from "./key";
import {InsightDatasetKind, InsightError} from "./IInsightFacade";

export class SComparison {
    private key: key;
    private cvalue: string;
    constructor(key1: key, cvalue: string) {
        this.key = key1;
        this.cvalue = cvalue;
    }
    public parseS(value: IDataSet): IDataSet {
        // if (value.ikind === InsightDatasetKind.Courses)
        let result: IDataSet = new IDataSet();
        try {
            if (value.ikind === InsightDatasetKind.Courses) {
                for (let fragment of value.ielements) {
                    switch (this.key) {
                        case key.subject: {
                            if (SComparison.checkAster(fragment.gisubject, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.id: {
                            if (SComparison.checkAster(fragment.giid, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.course: {
                            if (SComparison.checkAster(fragment.gicourse, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.prof: {
                            if (SComparison.checkAster(fragment.giprofessor, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.title: {
                            /*if (fragment.gititle === undefined) {
                                break;
                            }*/
                            if (SComparison.checkAster(fragment.gititle, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        default: {
                            throw new InsightError("invalid key");
                        }
                    }
                }
            }
            if (value.ikind === InsightDatasetKind.Rooms) {
                result.setkind = InsightDatasetKind.Rooms;
                for (let fragment of value.ielements) {
                    switch (this.key) {
                        case key.fullname: {
                            if (SComparison.checkAster(fragment.gifullname, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.shortname: {
                            if (SComparison.checkAster(fragment.gishortname, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.name: {
                            if (SComparison.checkAster(fragment.giname, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.number: {
                            if (SComparison.checkAster(fragment.ginumber, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.address: {
                            if (SComparison.checkAster(fragment.giaddress, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.type: {
                            if (SComparison.checkAster(fragment.gitype, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.furniture: {
                            if (SComparison.checkAster(fragment.gifurniture, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        case key.href: {
                            if (SComparison.checkAster(fragment.gihref, this.cvalue)) {
                                result.ielements.push(fragment);
                            }
                            break;
                        }
                        default: {
                            throw new InsightError("invalid key");
                        }
                    }
                }
            }
        } catch (e) {
            throw new InsightError(e);
        }
        return result;
    }
    private static checkAster(fragmentStr: string, cvalue: string): boolean {
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
        throw new InsightError("Invalid input string");
    }
}
