/**
 * Created by rtholmes on 2016-06-19.
 */

import fs = require("fs");
import restify = require("restify");
import Log from "../Util";
import InsightFacade from "../controller/InsightFacade";
import {InsightDatasetKind, InsightError, NotFoundError} from "../controller/IInsightFacade";

/**
 * This configures the REST endpoints for the server.
 */
export default class Server {

    private port: number;
    private rest: restify.Server;
    private ids: number[];
    private insightFacade: InsightFacade;

    constructor(port: number) {
        Log.info("Server::<init>( " + port + " )");
        this.port = port;
        this.ids = [];
        this.insightFacade = new InsightFacade();
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        Log.info("Server::close()");
        const that = this;
        return new Promise(function (fulfill) {
            that.rest.close(function () {
                fulfill(true);
            });
        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        const that = this;
        return new Promise(function (fulfill, reject) {
            try {
                Log.info("Server::start() - start");

                that.rest = restify.createServer({
                    name: "insightUBC",
                });
                that.rest.use(restify.bodyParser({mapFiles: true, mapParams: true}));
                that.rest.use(
                    function crossOrigin(req, res, next) {
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "X-Requested-With");
                        return next();
                    });

                // This is an example endpoint that you can invoke by accessing this URL in your browser:
                // http://localhost:4321/echo/hello
                that.rest.get("/echo/:msg", Server.echo);
                that.rest.put("/dataset/:id/:kind", function (req, res, next) {
                    // Log.trace("Server::put(..) - params: " + JSON.stringify(req.params));
                    /*
                    try {
                        if (that.ids.includes(req.params.id)) {
                            res.json(400, {
                                error: `Dataset ID with id = ${req.params.id} exists.`
                            });
                            return next();
                        } else {
                            if (req.params.kind === "courses") {
                               // global.console.log("TEST IS HERE!!!!" + Object.keys(req.params.body));
                                that.insightFacade.addDataset(req.params.id, req.params.body,
                                    InsightDatasetKind.Courses).then((resul) => {
                                        res.json(200, {result: resul});
                                        return next();
                                }).catch((err) => {
                                    res.json(400, {
                                        error: "Adddataset courses error"
                                    });
                                });
                            } else {
                                that.insightFacade.addDataset(req.params.id,  req.params.body,
                                    InsightDatasetKind.Rooms).then((resul) => {
                                    res.json(200, {result: resul});
                                    return next();
                                }).catch((err) => {
                                    res.json(400, {
                                        error: "Adddataset rooms error"
                                    });
                                });
                            }
                        }
                    } catch (err) {
                        Log.error("Server::echo(..) - responding 400");
                        res.json(400, {error: err.message});
                    }*/
                    if (that.ids.includes(req.params.id)) {
                        res.json(400, {
                            error: `Dataset ID with id = ${req.params.id} exists.`
                        });
                        return next();
                    } else {
                        if (req.params.kind === "courses") {
                            // global.console.log("TEST IS HERE!!!!" + Object.keys(req.params.body));
                            that.insightFacade.addDataset(req.params.id, req.params.body,
                                InsightDatasetKind.Courses).then((resul) => {
                                res.json(200, {result: resul});
                                return next();
                            }).catch((err) => {
                                res.json(400, {
                                    error: "Adddataset courses error"
                                });
                            });
                        } else {
                            that.insightFacade.addDataset(req.params.id,  req.params.body,
                                InsightDatasetKind.Rooms).then((resul) => {
                                res.json(200, {result: resul});
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
                    /*
                    try {
                        that.insightFacade.removeDataset(req.params.id).then((resul) => {
                            res.json(200, {result: resul});
                            return next();
                        }).catch((err) => {
                            if (err instanceof  InsightError) {
                                res.json(400, {error: err.message});
                            }
                            if (err instanceof  NotFoundError) {
                                res.json(404, {error: err.message});
                            }
                        });
                    } catch (e) {
                        if (e instanceof  InsightError) {
                            Log.error("Server:: responding 400");
                            res.json(400, {error: e.message});
                        }
                        if (e instanceof NotFoundError) {
                            Log.error("Server:: responding 404");
                            res.json(404, {error: e.message});
                        }
                    }*/
                    that.insightFacade.removeDataset(req.params.id).then((resul) => {
                        res.json(200, {result: resul});
                        return next();
                    }).catch((err) => {
                        if (err instanceof  InsightError) {
                            res.json(400, {error: err.message});
                        }
                        if (err instanceof  NotFoundError) {
                            res.json(404, {error: err.message});
                        }
                    });
                });

                that.rest.post("/query", function (req, res, next) {
                    try {
                        that.insightFacade.performQuery(req.params)
                            .then((resul) => {
                            res.json(200, {result: resul});
                            return next();
                        }).catch((e) => {
                            global.console.log(e);
                            res.json(400, {error: e.message});
                        });
                    } catch (err) {
                        res.json(400, {error: err.message});
                    }
                });

                that.rest.get("/datasets", function (req, res, next) {
                   try {
                       that.insightFacade.listDatasets().then((resul) => {
                           res.json(200, {result: resul});
                           return next();
                       }).catch((err) => {
                           res.json(400, {error: err.message});
                       });
                   } catch (e) {
                       res.json(400, {error: e.message});
                   }
                });

                // NOTE: your endpoints should go here

                // This must be the last endpoint!
                that.rest.get("/.*", Server.getStatic);

                that.rest.listen(that.port, function () {
                    Log.info("Server::start() - restify listening: " + that.rest.url);
                    fulfill(true);
                });

                that.rest.on("error", function (err: string) {
                    // catches errors in restify start; unusual syntax due to internal
                    // node not using normal exceptions here
                    Log.info("Server::start() - restify ERROR: " + err);
                    reject(err);
                });

            } catch (err) {
                Log.error("Server::start() - ERROR: " + err);
                reject(err);
            }
        });
    }

    // The next two methods handle the echo service.
    // These are almost certainly not the best place to put these, but are here for your reference.
    // By updating the Server.echo function pointer above, these methods can be easily moved.
    private static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace("Server::echo(..) - params: " + JSON.stringify(req.params));
        try {
            const response = Server.performEcho(req.params.msg);
            Log.info("Server::echo(..) - responding " + 200);
            res.json(200, {result: response});
        } catch (err) {
            Log.error("Server::echo(..) - responding 400");
            res.json(400, {error: err});
        }
        return next();
    }

    private static performEcho(msg: string): string {
        if (typeof msg !== "undefined" && msg !== null) {
            return `${msg}...${msg}`;
        } else {
            return "Message not provided";
        }
    }

    private static getStatic(req: restify.Request, res: restify.Response, next: restify.Next) {
        const publicDir = "frontend/public/";
        Log.trace("RoutHandler::getStatic::" + req.url);
        let path = publicDir + "index.html";
        if (req.url !== "/") {
            path = publicDir + req.url.split("/").pop();
        }
        fs.readFile(path, function (err: Error, file: Buffer) {
            if (err) {
                res.send(500);
                Log.error(JSON.stringify(err));
                return next();
            }
            res.write(file);
            res.end();
            return next();
        });
    }

}
