import Server from "../src/rest/Server";

import InsightFacade from "../src/controller/InsightFacade";
import chai = require("chai");

import chaiHttp = require("chai-http");
import * as fs from "fs";
import {ITestQuery} from "./InsightFacade.spec";
import TestUtil from "./TestUtil";
import {expect} from "chai";
import {InsightDatasetKind, InsightError} from "../src/controller/IInsightFacade";
import Log from "../src/Util";

describe("Facade D3", function () {

    let facade: InsightFacade = null;
    let server: Server = null;

    chai.use(chaiHttp);

    before(function () {
        facade = new InsightFacade();
        server = new Server(4321);
        try {
            server.start();
        } catch (e) {
            global.console.log(e);
        }
        // TODO: start server here once and handle errors properly
    });

    after(function () {
        server.stop();
        // TODO: stop server here once!
    });

    beforeEach(function () {
        // might want to add some process logging here to keep track of what"s going on
    });

    afterEach(function () {
        // might want to add some process logging here to keep track of what"s going on
    });
    // TODO: read your courses and rooms datasets here once!

    // Hint on how to test PUT requests
    it("PUT test for courses dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .put("/dataset/courses/courses")
                .attach("body", fs.readFileSync("./test/data/courses.zip"), "courses.zip")
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect(res.status).to.be.equal(200);
                })
                .catch(function (err) {
                    // some logging here please!
                   // global.console.log(err);
                    chai.expect.fail();
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("PUT test for rooms dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .put("/dataset/rooms/rooms")
                .attach("body", fs.readFileSync("./test/data/rooms.zip"), "rooms.zip")
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect(res.status).to.be.equal(200);
                })
                .catch(function (err) {
                    // some logging here please!
                    // global.console.log(err);
                    chai.expect.fail();
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("POST test for valid query, expect 200", function () {
        try {
            return chai.request("http://localhost:4321")
                .post("/query")
                .send(JSON.parse(fs.readFileSync("./test/queries/q2.json", "utf8")).query)
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect(res.body.result).to.deep.equal(
                        JSON.parse(fs.readFileSync("./test/queries/q2.json", "utf8")).result);
                    chai.expect(res.status).to.be.equal(200);
                })
                .catch(function (err) {
                    // some logging here please!
                    // global.console.log(err);
                    chai.expect.fail();
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("POST test for invalid query, expect 400", function () {
        try {
            return chai.request("http://localhost:4321")
                .post("/query")
                .send(JSON.parse(fs.readFileSync("./test/queries/q3.json", "utf8")).query)
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect(res.body.result).to.deep.equal(
                        JSON.parse(fs.readFileSync("./test/queries/q3.json", "utf8")).result);
                    // chai.expect(res.status).to.be.equal(400);
                    chai.expect.fail();
                })
                .catch(function (err) {
                    // some logging here please!
                    // chai.expect(err.message).to.deep.equal("Bad Request");
                    chai.expect(err.status).to.be.equal(400);
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            // chai.expect.fail(err);
        }
    });
    it("GET test for rooms dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .get("/datasets")
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect(res.status).to.be.equal(200);
                })
                .catch(function (err) {
                    // some logging here please!
                    // global.console.log(err);
                    chai.expect.fail();
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("DEL test for courses dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .del("/dataset/courses")
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect(res.status).to.be.equal(200);
                })
                .catch(function (err) {
                    // some logging here please!
                    // global.console.log(err);
                    chai.expect.fail();
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("DEL test for rooms dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .del("/dataset/rooms")
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect(res.status).to.be.equal(200);
                })
                .catch(function (err) {
                    // some logging here please!
                    // global.console.log(err);
                    chai.expect.fail();
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("DEL test for unexisted dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .del("/dataset/courses100")
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect.fail();
                })
                .catch(function (err) {
                    // some logging here please!
                    // global.console.log(err);
                    chai.expect(err.status).to.be.equal(404);
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("echo test", function () {
        try {
            return chai.request("http://localhost:4321")
                .get("/echo/hello")
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect(res.status).to.be.equal(200);
                })
                .catch(function (err) {
                    // some logging here please!
                    // global.console.log(err);
                    chai.expect.fail();
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("echo test fail", function () {
        try {
            return chai.request("http://localhost:4321")
                .get("/echo")
                .then((res: ChaiHttp.Response) => {
                    // some logging here please!
                    chai.expect.fail();
                })
                .catch(function (err) {
                    // some logging here please!
                    // global.console.log(err);
                    chai.expect(err.status).to.be.equal(500);
                });
        } catch (err) {
            // and some more logging here!
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    // The other endpoints work similarly. You should be able to find all instructions at the chai-http documentation
});
