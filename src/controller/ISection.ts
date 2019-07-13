import {InsightError} from "./IInsightFacade";

export class ISection {
    set iid(value: string) {
        this.uuid = value;
    }

    set iprofessor(value: string) {
        this.instructor = value;
    }

    set iaudit(value: number) {
        this.audit = value;
    }

    set iyear(value: number) {
        this.year = value;
    }

    set icourse(value: string) {
        this.id = value;
    }

    set ipass(value: number) {
        this.pass = value;
    }

    set ifail(value: number) {
        this.fail = value;
    }

    set iavg(value: number) {
        this.avg = value;
    }

    set ititle(value: string) {
        this.title = value;
    }

    set isubject(value: string) {
        this.dept = value;
    }
    get giid(): string {
        return this.uuid;
    }

    get giprofessor(): string {
        return this.instructor;
    }

    get giaudit(): number {
        return this.audit;
    }

    get giyear(): number {
        return this.year;
    }

    get gicourse(): string {
        return this.id;
    }

    get gipass(): number {
        return this.pass;
    }

    get gifail(): number {
        return this.fail;
    }

    get giavg(): number {
        return this.avg;
    }

    get gititle(): string {
        return this.title;
    }

    get gisubject(): string {
        return this.dept;
    }
    private uuid: string;
    private instructor: string;
    private audit: number;
    private year: number;
    private id: string;
    private pass: number;
    private fail: number;
    private avg: number;
    private title: string;
    private dept: string;
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
    public get(ikey: string): any {
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
                throw new InsightError("Invalid key in iSection");
            }
        }
    }
    /*
    public isEqual(sec: ISection): boolean {
        return this.id === sec.giid && this.subject === sec.gisubject && this.title === sec.gititle
            && this.avg === sec.giavg && this.fail === sec.gifail && this.pass === sec.gipass &&
            this.course === sec.gicourse && this.year === sec.giyear && this.professor === sec.giprofessor
            && this.audit === sec.giaudit;
    }*/
}
