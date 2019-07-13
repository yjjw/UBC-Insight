import {expect} from "chai";

import {InsightDataset, InsightDatasetKind, InsightError, NotFoundError} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import TestUtil from "./TestUtil";
import {Logic, LogicComparison} from "../src/controller/logicComparison";
import {MComparator, MComparison} from "../src/controller/MComparison";
import {key} from "../src/controller/key";
import {IDataSet} from "../src/controller/IDataSet";
import {SComparison} from "../src/controller/SComparison";
import {Applytoken, ApplyToken} from "../src/controller/ApplyToken";
import {ISection} from "../src/controller/ISection";

// This should match the JSON schema described in test/query.schema.json
// except 'filename' which is injected when the file is read.
export interface ITestQuery {
    title: string;
    query: any;  // make any to allow testing structurally invalid queries
    isQueryValid: boolean;
    result: string | string[];
    filename: string;  // This is injected when reading the file
}

describe("InsightFacade Add/Remove Dataset", function () {
    // Reference any datasets you've added to test/data here and they will
    // automatically be loaded in the Before All hook.
    const datasetsToLoad: { [id: string]: string } = {
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

    let insightFacade: InsightFacade;
    let datasets: { [id: string]: string };

    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToLoad)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return {[Object.keys(datasetsToLoad)[i]]: buf.toString("base64")};
            });
            datasets = Object.assign({}, ...loadedDatasets);
            expect(Object.keys(datasets)).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    it("Should list all datasets (empty)", async () => {
        let response1: InsightDataset[];
        try {
            response1 = await insightFacade.listDatasets();
        } catch (err) {
            response1 = err;
        } finally {
            for (let i of response1) {
                let id: string = i.id;
                expect(id).to.deep.equal("");
            }
        }
    });

    it("Should add a valid dataset rooms", async () => {
        const id: string = "rooms";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Rooms);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([id]);
        }
    });
    it("test get in iroom", async () => {
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
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal(0);
        }
    });
    it("Should remove the rooms dataset", async () => {
        const id: string = "rooms";
        let response: string;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            global.console.log(insightFacade.datasets.length);
            expect(response).to.deep.equal(id);
        }
    });
    it("Should add a valid dataset", async () => {
        const id: string = "courses";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([id]);
        }
    });
    it("test get in isection", async () => {
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
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal(0);
        }
    });
    it("Should compare GT correctly", async () => {
        let response: IDataSet;
        let mco = new MComparison(MComparator.Gt, key.avg, 97);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        } catch (err) {
            response = err;
        } finally {
            expect(response.getLengthElements()).to.deep.equal(49);
        }
    });

    it("Should compare GT correctly", async () => {
        let response: IDataSet;
        let mco = new MComparison(MComparator.Gt, key.avg, 96);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        } catch (err) {
            response = err;
        } finally {
            expect(response.getLengthElements()).to.deep.equal(110);
        }
    });

    it("Should compare LT correctly", async () => {
        let response: IDataSet;
        let mco = new MComparison(MComparator.Lt, key.avg, 51);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        } catch (err) {
            response = err;
        } finally {
            expect(response.getLengthElements()).to.deep.equal(44);
        }
    });

    it("Should compare LT correctly", async () => {
        let response: IDataSet;
        let mco = new MComparison(MComparator.Lt, key.avg, 54);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        } catch (err) {
            response = err;
        } finally {
            expect(response.getLengthElements()).to.deep.equal(94);
        }
    });

    it("Should compare EQ correctly", async () => {
        let response: IDataSet;
        let mco = new MComparison(MComparator.Eq, key.avg, 77);
        try {
            response = mco.parseM(insightFacade.datasets[0]);
        } catch (err) {
            response = err;
        } finally {
            expect(response.getLengthElements()).to.deep.equal(124);
        }
    });

    it("Should compare IS correctly", async () => {
        let response: IDataSet;
        let mco = new SComparison(key.subject, "cpsc");
        try {
            response = mco.parseS(insightFacade.datasets[0]);
        } catch (err) {
            response = err;
        } finally {
            global.console.log(InsightFacade.datasetTonumber(response));
            expect(response.getLengthElements()).to.deep.equal(1111);
        }
    });

    // ZHU
    it("Should not add an empty dataset", async () => {
        const id: string = "nothing";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(InsightError);
        }

    });

    it("Should not add an dataset with txt(incorrect content)", async () => {
        const id: string = "onlyonetxt";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(InsightError);
        }

    });

    it("Should not add a file with empty JSON", async () => {
        const id: string = "incompletejson";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(InsightError);
        }

    });

    it("Should not add a file with JSON(incorrect syntax)", async () => {
        const id: string = "incomplete";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(InsightError);
        }

    });

    it("Should not add a zip with compound folders", async () => {
        const id: string = "compoundfolders";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(InsightError);
        }

    });

    it("Should not add a dataset with zero course section", async () => {
        const id: string = "zerocoursesection";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(InsightError);
        }

    });

    it("Should add a file with both correct and incorrect files", async () => {
        const id: string = "complex";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal(["courses", id]);
        }

    });

    /*it("Should compare Not correctly", async () => {
        let response: IDataSet;
        try {
            response = Negation.parseN(insightFacade.datasets[0], insightFacade.datasets[0]);
        } catch (err) {
            response = err;
        } finally {
            expect(response.getLengthSections()).to.deep.equal(insightFacade.datasets[0].getLengthSections()
                - insightFacade.datasets[1].getLengthSections());
        }
    });*/

    it("Should not add files that are not zip", async () => {
        const id: string = "otherfiles";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(InsightError);
        }

    });

    it("Should not add files with no valid section", async () => {
        const id: string = "novalidsection";
        let response: string[];

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(InsightError);
        }

    });

    it("Should add a file with both duplicate dataset but different ids", async () => {
        const id1: string = "duplicate";
        let response1: string[];

        try {
            response1 = await insightFacade.addDataset(id1, datasets[id1], InsightDatasetKind.Courses);
        } catch (err) {
            response1 = err;
        } finally {
            expect(response1).to.deep.equal(["courses", "complex", id1]);
        }

    });

    it("Should add a simple dataset", async () => {
        const id1: string = "simple";
        let response1: string[];

        try {
            response1 = await insightFacade.addDataset(id1, datasets[id1], InsightDatasetKind.Courses);
        } catch (err) {
            response1 = err;
        } finally {
            expect(response1).to.deep.equal(["courses", "complex", "duplicate", id1]);
        }
    });

    it("Should not add a file with undefined id", async () => {
        const id: string = undefined;
        let response1: string[];

        try {
            response1 = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response1 = err;
        } finally {
            expect(response1).to.be.instanceOf(InsightError);
        }

    });

    it("Should list all datasets", async () => {
        let response1: InsightDataset[];
        try {
            response1 = await insightFacade.listDatasets();
        } catch (err) {
            response1 = err;
        } finally {
            for (let i of response1) {
                let bool: boolean = false;
                let id: string = i.id;
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

                expect(bool).to.deep.equal(true);
            }
        }
    });

    it("Should not add a file with both duplicate dataset with same id", async () => {
        const id1: string = "courses";
        let response1: string[];

        try {
            response1 = await insightFacade.addDataset(id1, datasets[id1], InsightDatasetKind.Courses);
        } catch (err) {
            response1 = err;
        } finally {
            expect(response1).to.be.instanceOf(InsightError);
        }

    });

    // This is an example of a pending test. Add a callback function to make the test run.
    it("Should remove the courses dataset", async () => {
        const id: string = "courses";
        let response: string;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal(id);
        }
    });

    it("Should not remove the dataset", async () => {
        const id: string = "courses2";
        let response: string;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(NotFoundError);
        }
    });

    it("LogicComparison test intersection", async () => {
        let arr1 = [1, 2, 3];
        let arr2 = [3, 2, 4];
        let response = [];

        try {
            response = LogicComparison.intersection(arr1, arr2);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([2, 3]);
        }
    });
    it("LogicComparison test AND", async () => {
        let arr1 = [[1, 2, 3], [3, 2, 4], [3, 7, 2]];
        let logi = new LogicComparison(Logic.And, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([2, 3]);
        }
    });

    it("LogicComparison test OR with multiple arrays", async () => {
        let arr1 = [[1, 2, 3], [3, 2, 4], [6, 7, 8]];
        let logi = new LogicComparison(Logic.Or, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([1, 2, 3, 4, 6, 7, 8]);
        }
    });

    it("LogicComparison test OR with multiple array and empty array", async () => {
        let arr1 = [[1], [3, 2, 4], []];
        let logi = new LogicComparison(Logic.Or, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([1, 3, 2, 4]);
        }
    });

    it("LogicComparison test OR with empty array", async () => {
        let arr1: any[] = [[], [], []];
        let logi = new LogicComparison(Logic.Or, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([]);
        }
    });

    it("LogicComparison test OR with arrays of same elements", async () => {
        let arr1 = [[1, 2], [1, 2]];
        let logi = new LogicComparison(Logic.Or, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([1, 2]);
        }
    });

    it("LogicComparison test AND with exactly same arrays ", async () => {
        let arr1 = [[1, 2], [1, 2]];
        let logi = new LogicComparison(Logic.And, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([1, 2]);
        }
    });

    it("LogicComparison test AND with multiple arrays that don't have same element", async () => {
        let arr1 = [[1, 2], [4, 5], [6, 2]];
        let logi = new LogicComparison(Logic.And, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([]);
        }
    });

    it("LogicComparison test AND with multiple arrays that has same elements", async () => {
        let arr1 = [[1, 2, 3, 5], [4, 5, 3], [1, 9, 3, 5]];
        let logi = new LogicComparison(Logic.And, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([3, 5]);
        }
    });

    it("LogicComparison test AND with multiple arrays and empty array", async () => {
        let arr1 = [[1, 2], [4, 5], []];
        let logi = new LogicComparison(Logic.And, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([]);
        }
    });

    it("LogicComparison test AND with empty arrays", async () => {
        let arr1: any[][] = [[], [], []];
        let logi = new LogicComparison(Logic.And, arr1);
        let response = [];

        try {
            response = logi.parseLogic();
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal([]);
        }
    });

    /*
    it("ApplyToken test MAX", async () => {
        let arr1: object[] = [
            { courses_uuid: "1", courses_instructor: "Jean",  courses_avg: 90, courses_title : "310"},
            { courses_uuid: "2", courses_instructor: "Jean",  courses_avg: 80, courses_title : "310"},
            { courses_uuid: "3", courses_instructor: "Casey", courses_avg: 95, courses_title : "310"},
            { courses_uuid: "4", courses_instructor: "Casey", courses_avg: 85, courses_title : "310"},
        ];
        let applyt = new ApplyToken(Applytoken.MAX);
        let response = 0;

        try {
            response = applyt.applyOperation(arr1, "courses_avg");
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal(95);
        }
    });

    it("ApplyToken test MIN", async () => {
        let arr1: object[] = [
            { courses_uuid: "1", courses_instructor: "Jean",  courses_avg: 90, courses_title : "310"},
            { courses_uuid: "2", courses_instructor: "Jean",  courses_avg: 80, courses_title : "310"},
            { courses_uuid: "3", courses_instructor: "Casey", courses_avg: 95, courses_title : "310"},
            { courses_uuid: "4", courses_instructor: "Casey", courses_avg: 85, courses_title : "310"},
        ];
        let applyt = new ApplyToken(Applytoken.MIN);
        let response = 0;

        try {
            response = applyt.applyOperation(arr1, "courses_avg");
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal(80);
        }
    });

    it("ApplyToken test AVG", async () => {
        let arr1: object[] = [
            { courses_uuid: "1", courses_instructor: "Jean",  courses_avg: 90, courses_title : "310"},
            { courses_uuid: "2", courses_instructor: "Jean",  courses_avg: 80, courses_title : "310"},
            { courses_uuid: "3", courses_instructor: "Casey", courses_avg: 95, courses_title : "310"},
            { courses_uuid: "4", courses_instructor: "Casey", courses_avg: 85, courses_title : "310"},
        ];
        let applyt = new ApplyToken(Applytoken.AVG);
        let response = 0;

        try {
            response = applyt.applyOperation(arr1, "courses_avg");
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal(87.5);
        }
    });

    it("ApplyToken test COUNT", async () => {
        let arr1: object[] = [
            { courses_uuid: "1", courses_instructor: "Jean",  courses_avg: 90, courses_title : "310"},
            { courses_uuid: "2", courses_instructor: "Jean",  courses_avg: 80, courses_title : "310"},
            { courses_uuid: "3", courses_instructor: "Casey", courses_avg: 95, courses_title : "310"},
            { courses_uuid: "4", courses_instructor: "Casey", courses_avg: 85, courses_title : "310"},
            { courses_uuid: "5", courses_instructor: "Nick",  courses_avg: 85, courses_title : "310"},
            { courses_uuid: "6", courses_instructor: "Jim",   courses_avg: 85, courses_title : "310"},
        ];
        let applyt = new ApplyToken(Applytoken.COUNT);
        let response = 0;

        try {
            response = applyt.applyOperation(arr1, "courses_avg");
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal(4);
        }
    });

    it("ApplyToken test SUM", async () => {
        let arr1: object[] = [
            { courses_uuid: "1", courses_instructor: "Jean",  courses_avg: 90, courses_title : "310"},
            { courses_uuid: "2", courses_instructor: "Jean",  courses_avg: 80, courses_title : "310"},
            { courses_uuid: "3", courses_instructor: "Casey", courses_avg: 95, courses_title : "310"},
            { courses_uuid: "4", courses_instructor: "Casey", courses_avg: 85, courses_title : "310"},
        ];
        let applyt = new ApplyToken(Applytoken.SUM);
        let response = 0;

        try {
            response = applyt.applyOperation(arr1, "courses_avg");
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.deep.equal(350);
        }
    });*/

    it("Should not remove the empty dataset", async () => {
        const id: string = "";
        let response: string;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(NotFoundError);
        }
    });

    it("Should not remove the dataset with invalid id", async () => {
        let response: string;

        try {
            response = await insightFacade.removeDataset(undefined);
        } catch (err) {
            response = err;
        } finally {
            expect(response).to.be.instanceOf(InsightError);
        }
    });
});

// This test suite dynamically generates tests from the JSON files in test/queries.
// You should not need to modify it; instead, add additional files to the queries directory.
describe("InsightFacade PerformQuery", () => {
    const datasetsToQuery: { [id: string]: string } = {
        courses: "./test/data/courses.zip",
        simple: "./test/data/simple.zip",
        rooms: "./test/data/rooms.zip",
        rooms2: "./test/data/rooms2.zip"
    };
    let insightFacade: InsightFacade;
    let testQueries: ITestQuery[] = [];

    // Create a new instance of InsightFacade, read in the test queries from test/queries and
    // add the datasets specified in datasetsToQuery.
    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Load the query JSON files under test/queries.
        // Fail if there is a problem reading ANY query.
        try {
            testQueries = await TestUtil.readTestQueries();
            expect(testQueries).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more test queries. ${JSON.stringify(err)}`);
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }

        // Load the datasets specified in datasetsToQuery and add them to InsightFacade.
        // Fail if there is a problem reading ANY dataset.
        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToQuery)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return { [Object.keys(datasetsToQuery)[i]]: buf.toString("base64") };
            });
            expect(loadedDatasets).to.have.length.greaterThan(0);

            const responsePromises: Array<Promise<string[]>> = [];
            const datasets: { [id: string]: string } = Object.assign({}, ...loadedDatasets);
            /*
            for (const [id, content] of Object.entries(datasets)) {
                responsePromises.push(insightFacade.addDataset(id, content, InsightDatasetKind.Courses));
            }*/
            responsePromises.push(insightFacade.addDataset("courses", datasets["courses"], InsightDatasetKind.Courses));
            responsePromises.push(insightFacade.addDataset("simple", datasets["simple"], InsightDatasetKind.Courses));
            responsePromises.push(insightFacade.addDataset("rooms", datasets["rooms"], InsightDatasetKind.Rooms));
            responsePromises.push(insightFacade.addDataset("rooms2", datasets["rooms2"], InsightDatasetKind.Rooms));

            // This try/catch is a hack to let your dynamic tests execute even if the addDataset method fails.
            // In D1, you should remove this try/catch to ensure your datasets load successfully before trying
            // to run you queries.
            try {
                const responses: string[][] = await Promise.all(responsePromises);
                responses.forEach((response) => expect(response).to.be.an("array"));
            } catch (err) {
                Log.warn(`Ignoring addDataset errors. For D1, you should allow errors to fail the Before All hook.`);
            }
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    // Dynamically create and run a test for each query in testQueries
    it("Should run test queries", () => {
        describe("Dynamic InsightFacade PerformQuery tests", () => {
            for (const test of testQueries) {
                it(`[${test.filename}] ${test.title}`, async () => {
                    let response: any[];

                    try {
                        response = await insightFacade.performQuery(test.query);
                    } catch (err) {
                        response = err;
                    } finally {
                        if (test.isQueryValid) {
                            expect(response).to.deep.equal(test.result);
                        } else {
                            expect(response).to.be.instanceOf(InsightError);
                        }
                    }
                });
            }
        });
    });
});
