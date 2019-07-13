"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Negation {
    static parseN(value, originDataset) {
        let result = [];
        result = originDataset.filter((item) => value.indexOf(item) < 0);
        return result;
    }
}
exports.Negation = Negation;
//# sourceMappingURL=Negation.js.map