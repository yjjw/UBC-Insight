"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("./IInsightFacade");
class ISection {
    set iid(value) {
        this.uuid = value;
    }
    set iprofessor(value) {
        this.instructor = value;
    }
    set iaudit(value) {
        this.audit = value;
    }
    set iyear(value) {
        this.year = value;
    }
    set icourse(value) {
        this.id = value;
    }
    set ipass(value) {
        this.pass = value;
    }
    set ifail(value) {
        this.fail = value;
    }
    set iavg(value) {
        this.avg = value;
    }
    set ititle(value) {
        this.title = value;
    }
    set isubject(value) {
        this.dept = value;
    }
    get giid() {
        return this.uuid;
    }
    get giprofessor() {
        return this.instructor;
    }
    get giaudit() {
        return this.audit;
    }
    get giyear() {
        return this.year;
    }
    get gicourse() {
        return this.id;
    }
    get gipass() {
        return this.pass;
    }
    get gifail() {
        return this.fail;
    }
    get giavg() {
        return this.avg;
    }
    get gititle() {
        return this.title;
    }
    get gisubject() {
        return this.dept;
    }
    constructor() {
        this.uuid = "";
        this.instructor = "";
        this.audit = 0;
        this.year = 1990;
        this.id = "";
        this.pass = 0;
        this.fail = 0;
        this.avg = 0;
        this.title = "";
        this.dept = "";
    }
    get(ikey) {
        let splits = ikey.split("_");
        let key = splits[1];
        switch (key) {
            case "dept": {
                return this.dept;
            }
            case "id": {
                return this.id;
            }
            case "avg": {
                return this.avg;
            }
            case "instructor": {
                return this.instructor;
            }
            case "title": {
                return this.title;
            }
            case "pass": {
                return this.pass;
            }
            case "fail": {
                return this.fail;
            }
            case "audit": {
                return this.audit;
            }
            case "uuid": {
                return this.uuid;
            }
            case "year": {
                return this.year;
            }
            default: {
                throw new IInsightFacade_1.InsightError("Invalid key in iSection");
            }
        }
    }
}
exports.ISection = ISection;
//# sourceMappingURL=ISection.js.map