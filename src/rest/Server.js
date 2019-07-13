"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const restify = require("restify");
const Util_1 = require("../Util");
const InsightFacade_1 = require("../controller/InsightFacade");
const IInsightFacade_1 = require("../controller/IInsightFacade");
class Server {
    constructor(port) {
        Util_1.default.info("Server::<init>( " + port + " )");
        this.port = port;
        this.ids = [];
        this.insightFacade = new InsightFacade_1.default();
    }
    stop() {
        Util_1.default.info("Server::close()");
        const that = this;
        return new Promise(function (fulfill) {
            that.rest.close(function () {
                fulfill(true);
            });
        });
    }
    start() {
        const that = this;
        return new Promise(function (fulfill, reject) {
            try {
                Util_1.default.info("Server::start() - start");
                that.rest = restify.createServer({
                    name: "insightUBC",
                });
                that.rest.use(restify.bodyParser({ mapFiles: true, mapParams: true }));
                that.rest.use(function crossOrigin(req, res, next) {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Access-Control-Allow-Headers", "X-Requested-With");
                    return next();
                });
                that.rest.get("/echo/:msg", Server.echo);
                that.rest.put("/dataset/:id/:kind", function (req, res, next) {
                    if (that.ids.includes(req.params.id)) {
                        res.json(400, {
                            error: `Dataset ID with id = ${req.params.id} exists.`
                        });
                        return next();
                    }
                    else {
                        if (req.params.kind === "courses") {
                            that.insightFacade.addDataset(req.params.id, req.params.body, IInsightFacade_1.InsightDatasetKind.Courses).then((resul) => {
                                res.json(200, { result: resul });
                                return next();
                            }).catch((err) => {
                                res.json(400, {
                                    error: "Adddataset courses error"
                                });
                            });
                        }
                        else {
                            that.insightFacade.addDataset(req.params.id, req.params.body, IInsightFacade_1.InsightDatasetKind.Rooms).then((resul) => {
                                res.json(200, { result: resul });
                                return next();
                            }).catch((err) => {
                                res.json(400, {
                                    error: "Adddataset rooms error"
                                });
                            });
                        }
                    }
                });
                that.rest.del("/dataset/:id", function (req, res, next) {
                    that.insightFacade.removeDataset(req.params.id).then((resul) => {
                        res.json(200, { result: resul });
                        return next();
                    }).catch((err) => {
                        if (err instanceof IInsightFacade_1.InsightError) {
                            res.json(400, { error: err.message });
                        }
                        if (err instanceof IInsightFacade_1.NotFoundError) {
                            res.json(404, { error: err.message });
                        }
                    });
                });
                that.rest.post("/query", function (req, res, next) {
                    try {
                        that.insightFacade.performQuery(req.params)
                            .then((resul) => {
                            res.json(200, { result: resul });
                            return next();
                        }).catch((e) => {
                            global.console.log(e);
                            res.json(400, { error: e.message });
                        });
                    }
                    catch (err) {
                        res.json(400, { error: err.message });
                    }
                });
                that.rest.get("/datasets", function (req, res, next) {
                    try {
                        that.insightFacade.listDatasets().then((resul) => {
                            res.json(200, { result: resul });
                            return next();
                        }).catch((err) => {
                            res.json(400, { error: err.message });
                        });
                    }
                    catch (e) {
                        res.json(400, { error: e.message });
                    }
                });
                that.rest.get("/.*", Server.getStatic);
                that.rest.listen(that.port, function () {
                    Util_1.default.info("Server::start() - restify listening: " + that.rest.url);
                    fulfill(true);
                });
                that.rest.on("error", function (err) {
                    Util_1.default.info("Server::start() - restify ERROR: " + err);
                    reject(err);
                });
            }
            catch (err) {
                Util_1.default.error("Server::start() - ERROR: " + err);
                reject(err);
            }
        });
    }
    static echo(req, res, next) {
        Util_1.default.trace("Server::echo(..) - params: " + JSON.stringify(req.params));
        try {
            const response = Server.performEcho(req.params.msg);
            Util_1.default.info("Server::echo(..) - responding " + 200);
            res.json(200, { result: response });
        }
        catch (err) {
            Util_1.default.error("Server::echo(..) - responding 400");
            res.json(400, { error: err });
        }
        return next();
    }
    static performEcho(msg) {
        if (typeof msg !== "undefined" && msg !== null) {
            return `${msg}...${msg}`;
        }
        else {
            return "Message not provided";
        }
    }
    static getStatic(req, res, next) {
        const publicDir = "frontend/public/";
        Util_1.default.trace("RoutHandler::getStatic::" + req.url);
        let path = publicDir + "index.html";
        if (req.url !== "/") {
            path = publicDir + req.url.split("/").pop();
        }
        fs.readFile(path, function (err, file) {
            if (err) {
                res.send(500);
                Util_1.default.error(JSON.stringify(err));
                return next();
            }
            res.write(file);
            res.end();
            return next();
        });
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map