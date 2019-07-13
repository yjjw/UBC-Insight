import {IDataSet} from "./IDataSet";
import {key} from "./key";
import {InsightDatasetKind, InsightError} from "./IInsightFacade";

export enum MComparator {
    Lt = "LT",
    Gt = "GT",
    Eq = "EQ",
}
export class MComparison {
    private mc: MComparator;
    private key: key;
    private cvalue: number;
    constructor(mc: MComparator, key1: key, cvalue: string|number) {
        this.mc = mc;
        this.key = key1;
        this.cvalue = Number(cvalue);
    }
    public parseM(value: IDataSet): IDataSet {
        // if (this.cvalue)
        let result: IDataSet = new IDataSet();
        try {
            if (value.ikind === InsightDatasetKind.Courses) {
                if (this.mc === MComparator.Eq) {
                    for (let fragment of value.ielements) {
                        switch (this.key) {
                            case key.audit: {
                                if (fragment.giaudit === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key.avg: {
                                if (fragment.giavg === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            case key.fail: {
                                if (fragment.gifail === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            case key.pass: {
                                if (fragment.gipass === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            case key.year: {
                                if (fragment.giyear === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            default: {
                                break;
                            }
                        }
                    }
                }
                if (this.mc === MComparator.Gt) {
                    for (let fragment of value.ielements) {
                        switch (this.key) {
                            case key.audit: {
                                if (fragment.giaudit > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key.avg: {
                                if (fragment.giavg > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            case key.fail: {
                                if (fragment.gifail > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            case key.pass: {
                                if (fragment.gipass > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            case key.year: {
                                if (fragment.giyear > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            default: {
                                break;
                            }
                        }
                    }
                }
                if (this.mc === MComparator.Lt) {
                    for (let fragment of value.ielements) {
                        switch (this.key) {
                            case key.audit: {
                                if (fragment.giaudit < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key.avg: {
                                if (fragment.giavg < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            case key.fail: {
                                if (fragment.gifail < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            case key.pass: {
                                if (fragment.gipass < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            case key.year: {
                                if (fragment.giyear < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }

                            default: {
                                break;
                            }
                        }
                    }
                }
            }
            if (value.ikind === InsightDatasetKind.Rooms) {
                result.setkind = InsightDatasetKind.Rooms;
                if (this.mc === MComparator.Eq) {
                    for (let fragment of value.ielements) {
                        switch (this.key) {
                            case key.lat: {
                                if (fragment.gilat === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key.lon: {
                                if (fragment.gilon === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key.seats: {
                                if (fragment.giseats === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    }
                }
                if (this.mc === MComparator.Gt) {
                    for (let fragment of value.ielements) {
                        switch (this.key) {
                            case key.lat: {
                                if (fragment.gilat > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key.lon: {
                                if (fragment.gilon > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key.seats: {
                                if (fragment.giseats > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    }
                }
                if (this.mc === MComparator.Lt) {
                    for (let fragment of value.ielements) {
                        switch (this.key) {
                            case key.lat: {
                                if (fragment.gilat < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key.lon: {
                                if (fragment.gilon < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key.seats: {
                                if (fragment.giseats < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            throw new InsightError(e);
        }
        return result;
    }

}
