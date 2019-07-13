import {log} from "util";

export class IQuery {
    set ifilter(value: string) {
        this.fiter = value;
    }

    set ibody(value: string) {
        this.body = value;
    }
    set ioptions(value: string) {
        this.options = value;
    }

    set inegation(value: string) {
        this.negation = value;
    }

    set iscomparison(value: string) {
        this.scomparison = value;
    }

    set imcomparison(value: string) {
        this.mcomparison = value;
    }

    set ilogiccomparison(value: string) {
        this.logiccomparison = value;
    }
    private logiccomparison: string;
    private mcomparison: string;
    private scomparison: string;
    private negation: string;
    private fiter: string;
    private body: string;
    private options: string;
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
