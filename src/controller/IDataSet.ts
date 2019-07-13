import {InsightDatasetKind} from "./IInsightFacade";

export class IDataSet {
    private elements: any[];
    private id: string;
    private kind: InsightDatasetKind;
    set iid(value: string) {
        this.id = value;
    }
    get iid(): string {
        return this.id;
    }
    get ielements(): any[] {
        return this.elements;
    }
    set pushelements(element: any) {
        this.elements.push(element);
    }
    get ikind(): InsightDatasetKind {
        return this.kind;
    }
    set setkind(ikind: InsightDatasetKind) {
        this.kind = ikind;
    }
    // set setSections(isections: ISection[]) {
        // this.sections = isections;
    // }
    constructor() {
        this.elements = [];
        this.id = "";
        this.kind = InsightDatasetKind.Courses;
    }
    public getLengthElements(): number {
        return this.elements.length;
    }
}
