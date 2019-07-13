"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IDataSet_1 = require("./IDataSet");
const key_1 = require("./key");
const IInsightFacade_1 = require("./IInsightFacade");
var MComparator;
(function (MComparator) {
    MComparator["Lt"] = "LT";
    MComparator["Gt"] = "GT";
    MComparator["Eq"] = "EQ";
})(MComparator = exports.MComparator || (exports.MComparator = {}));
class MComparison {
    constructor(mc, key1, cvalue) {
        this.mc = mc;
        this.key = key1;
        this.cvalue = Number(cvalue);
    }
    parseM(value) {
        let result = new IDataSet_1.IDataSet();
        try {
            if (value.ikind === IInsightFacade_1.InsightDatasetKind.Courses) {
                if (this.mc === MComparator.Eq) {
                    for (let fragment of value.ielements) {
                        switch (this.key) {
                            case key_1.key.audit: {
                                if (fragment.giaudit === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.avg: {
                                if (fragment.giavg === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.fail: {
                                if (fragment.gifail === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.pass: {
                                if (fragment.gipass === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.year: {
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
                            case key_1.key.audit: {
                                if (fragment.giaudit > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.avg: {
                                if (fragment.giavg > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.fail: {
                                if (fragment.gifail > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.pass: {
                                if (fragment.gipass > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.year: {
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
                            case key_1.key.audit: {
                                if (fragment.giaudit < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.avg: {
                                if (fragment.giavg < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.fail: {
                                if (fragment.gifail < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.pass: {
                                if (fragment.gipass < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.year: {
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
            if (value.ikind === IInsightFacade_1.InsightDatasetKind.Rooms) {
                result.setkind = IInsightFacade_1.InsightDatasetKind.Rooms;
                if (this.mc === MComparator.Eq) {
                    for (let fragment of value.ielements) {
                        switch (this.key) {
                            case key_1.key.lat: {
                                if (fragment.gilat === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.lon: {
                                if (fragment.gilon === this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.seats: {
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
                            case key_1.key.lat: {
                                if (fragment.gilat > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.lon: {
                                if (fragment.gilon > this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.seats: {
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
                            case key_1.key.lat: {
                                if (fragment.gilat < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.lon: {
                                if (fragment.gilon < this.cvalue) {
                                    result.ielements.push(fragment);
                                }
                                break;
                            }
                            case key_1.key.seats: {
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
        }
        catch (e) {
            throw new IInsightFacade_1.InsightError(e);
        }
        return result;
    }
}
exports.MComparison = MComparison;
//# sourceMappingURL=MComparison.js.map