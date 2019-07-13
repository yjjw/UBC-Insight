export enum Logic {
    And = "AND",
    Or = "OR",
}
export class LogicComparison {
    private logic: Logic;
    private value: any[][];
    constructor(logic: Logic, value: any[][]) {        // parse id in
        this.logic = logic;
        this.value = value;
    }
    public parseLogic(): any[] {
        let result: any[] = this.value[0];
        if (this.logic === Logic.And) {
            for (let fragment of this.value) {
                result = LogicComparison.intersection(result, fragment);
            }
        }
        if (this.logic === Logic.Or) {
            for (let fragment of this.value) {
                result = LogicComparison.unit(result, fragment);
            }
        }
        return result;
    }
    public static intersection(arr1: any[], arr2: any[]): any[]  {
        let result: any[] = [];
        for (let e of arr1) {
            if (arr2.includes(e)) {
                result.push(e);
            }
        }
        return result;
    }
    public static unit(arr1: any[], arr2: any[]): any[]  {
        let result: any[] = arr1;
        for (let e of arr2) {
            if (!result.includes(e)) {
                result.push(e);
            }
        }
        return result;
    }
}
