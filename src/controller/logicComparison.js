"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logic;
(function (Logic) {
    Logic["And"] = "AND";
    Logic["Or"] = "OR";
})(Logic = exports.Logic || (exports.Logic = {}));
class LogicComparison {
    constructor(logic, value) {
        this.logic = logic;
        this.value = value;
    }
    parseLogic() {
        let result = this.value[0];
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
    static intersection(arr1, arr2) {
        let result = [];
        for (let e of arr1) {
            if (arr2.includes(e)) {
                result.push(e);
            }
        }
        return result;
    }
    static unit(arr1, arr2) {
        let result = arr1;
        for (let e of arr2) {
            if (!result.includes(e)) {
                result.push(e);
            }
        }
        return result;
    }
}
exports.LogicComparison = LogicComparison;
//# sourceMappingURL=logicComparison.js.map