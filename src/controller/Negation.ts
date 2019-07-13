import {IDataSet} from "./IDataSet";
import {key} from "./key";

export class Negation {
    public static parseN(value: number[], originDataset: number[]): number[] {
        let result: number[] = [];
        result = originDataset.filter((item) => value.indexOf(item) < 0);
        /*for (let fragment of originDataset) {
            if (!value.includes(fragment)) {
                result.push(fragment);
            }
        }*/
        return result;
    }
}
