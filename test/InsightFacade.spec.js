"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const IInsightFacade_1 = require("../src/controller/IInsightFacade");
const InsightFacade_1 = require("../src/controller/InsightFacade");
const Util_1 = require("../src/Util");
const TestUtil_1 = require("./TestUtil");
const logicComparison_1 = require("../src/controller/logicComparison");
const MComparison_1 = require("../src/controller/MComparison");
const key_1 = require("../src/controller/key");
const SComparison_1 = require("../src/controller/SComparison");
describe("InsightFacade Add/Remove Dataset", function () {
    const datasetsToLoad = {
        courses: "./test/data/courses.zip",
        rooms: "./test/data/rooms.zip",
        duplicate: "./test/data/duplicate.zip",
        nothing: "./test/data/nothing.zip",
        onlyonetxt: "./test/data/onlyonetxt.zip",
        complex: "./test/data/complex.zip",
        incomplete: "./test/data/incomplete.zip",
        incompletejson: "./test/data/incompletejson.zip",
        otherfiles: "./test/data/otherfiles.txt",
        compoundfolders: "./test/data/compoundfolders.zip",
        zerocoursesection: "./test/data/zerocoursesection.zip",
        novalidsection: "./test/data/novalidsection.zip",
        simple: "./test/data/simple.zip",
    };
    let insightFacade;
    let datasets;
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            Util_1.default.test(`Before: ${this.test.parent.title}`);
            try {
                const loadDatasetPromises = [];
                for (const [id, path] of Object.entries(datasetsToLoad)) {
                    loadDatasetPromises.push(TestUtil_1.default.readFileAsync(path));
                }
                const loadedDatasets = (yield Promise.all(loadDatasetPromises)).map((buf, i) => {
                    return { [Object.keys(datasetsToLoad)[i]]: buf.toString("base64") };
                });
                datasets = Object.assign({}, ...loadedDatasets);
                chai_1.expect(Object.keys(datasets)).to.have.length.greaterThan(0);
            }
            catch (err) {
                chai_1.expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
            }
            try {
                insightFacade = new InsightFacade_1.default();
            }
            catch (err) {
                Util_1.default.error(err);
            }
            finally {
                chai_1.expect(insightFacade).to.be.instanceOf(InsightFacade_1.default);
            }
        });
    });
    beforeEach(function () {
        Util_1.default.test(`BeforeTest: ${this.currentTest.title}`);
    });
    after(function () {
        Util_1.default.test(`After: ${this.test.parent.title}`);
    });
    afterEach(function () {
        Util_1.default.test(`AfterTest: ${this.currentTest.title}`);
    });
    it("Should list all datasets (empty)", () => __awaiter(this, void 0, void 0, function* () {
        let response1;
        try {
            response1 = yield insightFacade.listDatasets();
        }
        catch (err) {
            response1 = err;
        }
        finally {
            for (let i of response1) {
                let id = i.id;
                chai_1.expect(id).to.deep.equal("");
            }
        }
    }));
    it("Should add a valid dataset rooms", () => __awaiter(this, void 0, void 0, function* () {
        const id = "rooms";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Rooms);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([id]);
        }
    }));
    it("test get in iroom", () => __awaiter(this, void 0, void 0, function* () {
        let datasetElement = insightFacade.datasets[0].ielements;
        let response = 0;
        try {
            datasetElement[0].get("rooms_fullname");
            datasetElement[0].get("rooms_number");
            datasetElement[0].get("rooms_address");
            datasetElement[0].get("rooms_lat");
            datasetElement[0].get("rooms_lon");
            datasetElement[0].get("rooms_name");
            datasetElement[0].get("rooms_seats");
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal(0);
        }
    }));
    it("Should remove the rooms dataset", () => __awaiter(this, void 0, void 0, function* () {
        const id = "rooms";
        let response;
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            global.console.log(insightFacade.datasets.length);
            chai_1.expect(response).to.deep.equal(id);
        }
    }));
    it("Should add a valid dataset", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([id]);
        }
    }));
    it("test get in isection", () => __awaiter(this, void 0, void 0, function* () {
        let datasetElement = insightFacade.datasets[0].ielements;
        let response = 0;
        try {
            datasetElement[0].get("courses_dept");
            datasetElement[0].get("courses_id");
            datasetElement[0].get("courses_avg");
            datasetElement[0].get("courses_instructor");
            datasetElement[0].get("courses_title");
            datasetElement[0].get("courses_pass");
            datasetElement[0].get("courses_fail");
            datasetElement[0].get("courses_audit");
            datasetElement[0].get("courses_uuid");
            datasetElement[0].get("courses_year");
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal(0);
        }
    }));
    it("Should compare GT correctly", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        let mco = new MComparison_1.MComparison(MComparison_1.MComparator.Gt, key_1.key.avg, 97);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.getLengthElements()).to.deep.equal(49);
        }
    }));
    it("Should compare GT correctly", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        let mco = new MComparison_1.MComparison(MComparison_1.MComparator.Gt, key_1.key.avg, 96);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.getLengthElements()).to.deep.equal(110);
        }
    }));
    it("Should compare LT correctly", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        let mco = new MComparison_1.MComparison(MComparison_1.MComparator.Lt, key_1.key.avg, 51);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.getLengthElements()).to.deep.equal(44);
        }
    }));
    it("Should compare LT correctly", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        let mco = new MComparison_1.MComparison(MComparison_1.MComparator.Lt, key_1.key.avg, 54);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.getLengthElements()).to.deep.equal(94);
        }
    }));
    it("Should compare EQ correctly", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        let mco = new MComparison_1.MComparison(MComparison_1.MComparator.Eq, key_1.key.avg, 77);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.getLengthElements()).to.deep.equal(124);
        }
    }));
    it("Should compare IS correctly", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        let mco = new SComparison_1.SComparison(key_1.key.subject, "cpsc");
        try {
            response = mco.parseS(insightFacade.datasets[0]);
        }
        catch (err) {
            response = err;
        }
        finally {
            global.console.log(InsightFacade_1.default.datasetTonumber(response));
            chai_1.expect(response.getLengthElements()).to.deep.equal(1111);
        }
    }));
    it("Should not add an empty dataset", () => __awaiter(this, void 0, void 0, function* () {
        const id = "nothing";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should not add an dataset with txt(incorrect content)", () => __awaiter(this, void 0, void 0, function* () {
        const id = "onlyonetxt";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should not add a file with empty JSON", () => __awaiter(this, void 0, void 0, function* () {
        const id = "incompletejson";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should not add a file with JSON(incorrect syntax)", () => __awaiter(this, void 0, void 0, function* () {
        const id = "incomplete";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should not add a zip with compound folders", () => __awaiter(this, void 0, void 0, function* () {
        const id = "compoundfolders";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should not add a dataset with zero course section", () => __awaiter(this, void 0, void 0, function* () {
        const id = "zerocoursesection";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should add a file with both correct and incorrect files", () => __awaiter(this, void 0, void 0, function* () {
        const id = "complex";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal(["courses", id]);
        }
    }));
    it("Should not add files that are not zip", () => __awaiter(this, void 0, void 0, function* () {
        const id = "otherfiles";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should not add files with no valid section", () => __awaiter(this, void 0, void 0, function* () {
        const id = "novalidsection";
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should add a file with both duplicate dataset but different ids", () => __awaiter(this, void 0, void 0, function* () {
        const id1 = "duplicate";
        let response1;
        try {
            response1 = yield insightFacade.addDataset(id1, datasets[id1], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response1 = err;
        }
        finally {
            chai_1.expect(response1).to.deep.equal(["courses", "complex", id1]);
        }
    }));
    it("Should add a simple dataset", () => __awaiter(this, void 0, void 0, function* () {
        const id1 = "simple";
        let response1;
        try {
            response1 = yield insightFacade.addDataset(id1, datasets[id1], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response1 = err;
        }
        finally {
            chai_1.expect(response1).to.deep.equal(["courses", "complex", "duplicate", id1]);
        }
    }));
    it("Should not add a file with undefined id", () => __awaiter(this, void 0, void 0, function* () {
        const id = undefined;
        let response1;
        try {
            response1 = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response1 = err;
        }
        finally {
            chai_1.expect(response1).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should list all datasets", () => __awaiter(this, void 0, void 0, function* () {
        let response1;
        try {
            response1 = yield insightFacade.listDatasets();
        }
        catch (err) {
            response1 = err;
        }
        finally {
            for (let i of response1) {
                let bool = false;
                let id = i.id;
                switch (id) {
                    case "courses": {
                        bool = true;
                        break;
                    }
                    case "complex": {
                        bool = true;
                        break;
                    }
                    case "duplicate": {
                        bool = true;
                        break;
                    }
                    case "simple": {
                        bool = true;
                        break;
                    }
                    default: {
                        break;
                    }
                }
                chai_1.expect(bool).to.deep.equal(true);
            }
        }
    }));
    it("Should not add a file with both duplicate dataset with same id", () => __awaiter(this, void 0, void 0, function* () {
        const id1 = "courses";
        let response1;
        try {
            response1 = yield insightFacade.addDataset(id1, datasets[id1], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response1 = err;
        }
        finally {
            chai_1.expect(response1).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
    it("Should remove the courses dataset", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        let response;
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal(id);
        }
    }));
    it("Should not remove the dataset", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses2";
        let response;
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.NotFoundError);
        }
    }));
    it("LogicComparison test intersection", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [1, 2, 3];
        let arr2 = [3, 2, 4];
        let response = [];
        try {
            response = logicComparison_1.LogicComparison.intersection(arr1, arr2);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([2, 3]);
        }
    }));
    it("LogicComparison test AND", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[1, 2, 3], [3, 2, 4], [3, 7, 2]];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.And, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([2, 3]);
        }
    }));
    it("LogicComparison test OR with multiple arrays", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[1, 2, 3], [3, 2, 4], [6, 7, 8]];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.Or, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([1, 2, 3, 4, 6, 7, 8]);
        }
    }));
    it("LogicComparison test OR with multiple array and empty array", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[1], [3, 2, 4], []];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.Or, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([1, 3, 2, 4]);
        }
    }));
    it("LogicComparison test OR with empty array", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[], [], []];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.Or, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([]);
        }
    }));
    it("LogicComparison test OR with arrays of same elements", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[1, 2], [1, 2]];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.Or, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([1, 2]);
        }
    }));
    it("LogicComparison test AND with exactly same arrays ", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[1, 2], [1, 2]];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.And, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([1, 2]);
        }
    }));
    it("LogicComparison test AND with multiple arrays that don't have same element", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[1, 2], [4, 5], [6, 2]];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.And, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([]);
        }
    }));
    it("LogicComparison test AND with multiple arrays that has same elements", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[1, 2, 3, 5], [4, 5, 3], [1, 9, 3, 5]];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.And, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([3, 5]);
        }
    }));
    it("LogicComparison test AND with multiple arrays and empty array", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[1, 2], [4, 5], []];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.And, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([]);
        }
    }));
    it("LogicComparison test AND with empty arrays", () => __awaiter(this, void 0, void 0, function* () {
        let arr1 = [[], [], []];
        let logi = new logicComparison_1.LogicComparison(logicComparison_1.Logic.And, arr1);
        let response = [];
        try {
            response = logi.parseLogic();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.deep.equal([]);
        }
    }));
    it("Should not remove the empty dataset", () => __awaiter(this, void 0, void 0, function* () {
        const id = "";
        let response;
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.NotFoundError);
        }
    }));
    it("Should not remove the dataset with invalid id", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        try {
            response = yield insightFacade.removeDataset(undefined);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
        }
    }));
});
describe("InsightFacade PerformQuery", () => {
    const datasetsToQuery = {
        courses: "./test/data/courses.zip",
        simple: "./test/data/simple.zip",
        rooms: "./test/data/rooms.zip",
        rooms2: "./test/data/rooms2.zip"
    };
    let insightFacade;
    let testQueries = [];
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            Util_1.default.test(`Before: ${this.test.parent.title}`);
            try {
                testQueries = yield TestUtil_1.default.readTestQueries();
                chai_1.expect(testQueries).to.have.length.greaterThan(0);
            }
            catch (err) {
                chai_1.expect.fail("", "", `Failed to read one or more test queries. ${JSON.stringify(err)}`);
            }
            try {
                insightFacade = new InsightFacade_1.default();
            }
            catch (err) {
                Util_1.default.error(err);
            }
            finally {
                chai_1.expect(insightFacade).to.be.instanceOf(InsightFacade_1.default);
            }
            try {
                const loadDatasetPromises = [];
                for (const [id, path] of Object.entries(datasetsToQuery)) {
                    loadDatasetPromises.push(TestUtil_1.default.readFileAsync(path));
                }
                const loadedDatasets = (yield Promise.all(loadDatasetPromises)).map((buf, i) => {
                    return { [Object.keys(datasetsToQuery)[i]]: buf.toString("base64") };
                });
                chai_1.expect(loadedDatasets).to.have.length.greaterThan(0);
                const responsePromises = [];
                const datasets = Object.assign({}, ...loadedDatasets);
                responsePromises.push(insightFacade.addDataset("courses", datasets["courses"], IInsightFacade_1.InsightDatasetKind.Courses));
                responsePromises.push(insightFacade.addDataset("simple", datasets["simple"], IInsightFacade_1.InsightDatasetKind.Courses));
                responsePromises.push(insightFacade.addDataset("rooms", datasets["rooms"], IInsightFacade_1.InsightDatasetKind.Rooms));
                responsePromises.push(insightFacade.addDataset("rooms2", datasets["rooms2"], IInsightFacade_1.InsightDatasetKind.Rooms));
                try {
                    const responses = yield Promise.all(responsePromises);
                    responses.forEach((response) => chai_1.expect(response).to.be.an("array"));
                }
                catch (err) {
                    Util_1.default.warn(`Ignoring addDataset errors. For D1, you should allow errors to fail the Before All hook.`);
                }
            }
            catch (err) {
                chai_1.expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
            }
        });
    });
    beforeEach(function () {
        Util_1.default.test(`BeforeTest: ${this.currentTest.title}`);
    });
    after(function () {
        Util_1.default.test(`After: ${this.test.parent.title}`);
    });
    afterEach(function () {
        Util_1.default.test(`AfterTest: ${this.currentTest.title}`);
    });
    it("Should run test queries", () => {
        describe("Dynamic InsightFacade PerformQuery tests", () => {
            for (const test of testQueries) {
                it(`[${test.filename}] ${test.title}`, () => __awaiter(this, void 0, void 0, function* () {
                    let response;
                    try {
                        response = yield insightFacade.performQuery(test.query);
                    }
                    catch (err) {
                        response = err;
                    }
                    finally {
                        if (test.isQueryValid) {
                            chai_1.expect(response).to.deep.equal(test.result);
                        }
                        else {
                            chai_1.expect(response).to.be.instanceOf(IInsightFacade_1.InsightError);
                        }
                    }
                }));
            }
        });
    });
});
//# sourceMappingURL=InsightFacade.spec.js.map