"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("../src/rest/Server");
const InsightFacade_1 = require("../src/controller/InsightFacade");
const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
describe("Facade D3", function () {
    let facade = null;
    let server = null;
    chai.use(chaiHttp);
    before(function () {
        facade = new InsightFacade_1.default();
        server = new Server_1.default(4321);
        try {
            server.start();
        }
        catch (e) {
            global.console.log(e);
        }
    });
    after(function () {
        server.stop();
    });
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it("PUT test for courses dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .put("/dataset/courses/courses")
                .attach("body", fs.readFileSync("./test/data/courses.zip"), "courses.zip")
                .then((res) => {
                chai.expect(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                chai.expect.fail();
            });
        }
        catch (err) {
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("PUT test for rooms dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .put("/dataset/rooms/rooms")
                .attach("body", fs.readFileSync("./test/data/rooms.zip"), "rooms.zip")
                .then((res) => {
                chai.expect(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                chai.expect.fail();
            });
        }
        catch (err) {
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("POST test for valid query, expect 200", function () {
        try {
            return chai.request("http://localhost:4321")
                .post("/query")
                .send(JSON.parse(fs.readFileSync("./test/queries/q2.json", "utf8")).query)
                .then((res) => {
                chai.expect(res.body.result).to.deep.equal(JSON.parse(fs.readFileSync("./test/queries/q2.json", "utf8")).result);
                chai.expect(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                chai.expect.fail();
            });
        }
        catch (err) {
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("POST test for invalid query, expect 400", function () {
        try {
            return chai.request("http://localhost:4321")
                .post("/query")
                .send(JSON.parse(fs.readFileSync("./test/queries/q3.json", "utf8")).query)
                .then((res) => {
                chai.expect(res.body.result).to.deep.equal(JSON.parse(fs.readFileSync("./test/queries/q3.json", "utf8")).result);
                chai.expect.fail();
            })
                .catch(function (err) {
                chai.expect(err.status).to.be.equal(400);
            });
        }
        catch (err) {
            global.console.log(err);
        }
    });
    it("GET test for rooms dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .get("/datasets")
                .then((res) => {
                chai.expect(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                chai.expect.fail();
            });
        }
        catch (err) {
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("DEL test for courses dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .del("/dataset/courses")
                .then((res) => {
                chai.expect(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                chai.expect.fail();
            });
        }
        catch (err) {
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("DEL test for rooms dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .del("/dataset/rooms")
                .then((res) => {
                chai.expect(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                chai.expect.fail();
            });
        }
        catch (err) {
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("DEL test for unexisted dataset", function () {
        try {
            return chai.request("http://localhost:4321")
                .del("/dataset/courses100")
                .then((res) => {
                chai.expect.fail();
            })
                .catch(function (err) {
                chai.expect(err.status).to.be.equal(404);
            });
        }
        catch (err) {
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("echo test", function () {
        try {
            return chai.request("http://localhost:4321")
                .get("/echo/hello")
                .then((res) => {
                chai.expect(res.status).to.be.equal(200);
            })
                .catch(function (err) {
                chai.expect.fail();
            });
        }
        catch (err) {
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
    it("echo test fail", function () {
        try {
            return chai.request("http://localhost:4321")
                .get("/echo")
                .then((res) => {
                chai.expect.fail();
            })
                .catch(function (err) {
                chai.expect(err.status).to.be.equal(500);
            });
        }
        catch (err) {
            global.console.log(err);
            chai.expect.fail(err);
        }
    });
});
//# sourceMappingURL=Server.spec.js.map