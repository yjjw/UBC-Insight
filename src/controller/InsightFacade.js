"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../Util");
const IInsightFacade_1 = require("./IInsightFacade");
const IDataSet_1 = require("./IDataSet");
const ISection_1 = require("./ISection");
const JSZip = require("jszip");
const logicComparison_1 = require("./logicComparison");
const key_1 = require("./key");
const MComparison_1 = require("./MComparison");
const fs = require("fs");
const SComparison_1 = require("./SComparison");
const Negation_1 = require("./Negation");
const parse5 = require("parse5");
const IRoom_1 = require("./IRoom");
const http = require("http");
const ApplyToken_1 = require("./ApplyToken");
class InsightFacade {
    constructor() {
        Util_1.default.trace("InsightFacadeImpl::init()");
        this.ids = [];
        this.datasets = [];
        this.insightDatasets = [];
    }
    addDataset(id, content, kind) {
        let ids = this.ids;
        let localClass = this;
        let dataset = new IDataSet_1.IDataSet();
        let insightDataset;
        if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
            insightDataset = {
                id: "courses",
                kind: IInsightFacade_1.InsightDatasetKind.Courses,
                numRows: 0,
            };
        }
        if (kind === IInsightFacade_1.InsightDatasetKind.Rooms) {
            insightDataset = {
                id: "rooms",
                kind: IInsightFacade_1.InsightDatasetKind.Rooms,
                numRows: 0,
            };
        }
        dataset.iid = id;
        dataset.setkind = kind;
        insightDataset.id = id;
        insightDataset.kind = kind;
        insightDataset.numRows = 0;
        return new Promise(function (resolve, reject) {
            if (id === "" || id === undefined || id === null) {
                return reject(new IInsightFacade_1.InsightError("Invalid id"));
            }
            if (content === "" || content === undefined || content === null) {
                return reject(new IInsightFacade_1.InsightError("Invalid content"));
            }
            if (kind === null || kind === undefined) {
                return reject(new IInsightFacade_1.InsightError("Invalid kind"));
            }
            let zip = new JSZip();
            let promises = [];
            for (let id1 of ids) {
                if (id === id1) {
                    return reject(new IInsightFacade_1.InsightError("Duplicate datasets"));
                }
            }
            if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
                zip.loadAsync(content, { base64: true }).catch(function () {
                    return reject(new IInsightFacade_1.InsightError("Not a valid zip file1"));
                }).then(function (result1) {
                    result1.folder("courses").forEach(function (path, file) {
                        promises.push(file.async("text"));
                    });
                    Promise.all(promises).then(function (result) {
                        let courses = [];
                        for (const res of result) {
                            let course;
                            try {
                                course = JSON.parse(res).result;
                                for (const section of course) {
                                    let isection = new ISection_1.ISection();
                                    if (section.hasOwnProperty("id") && section.hasOwnProperty("Professor")
                                        && section.hasOwnProperty("Audit") && section.hasOwnProperty("Year") &&
                                        section.hasOwnProperty("Course") && section.hasOwnProperty("Pass")
                                        && section.hasOwnProperty("Fail") && section.hasOwnProperty("Avg") &&
                                        section.hasOwnProperty("Title") && section.hasOwnProperty("Subject")) {
                                        isection.iaudit = section.Audit;
                                        isection.iid = section.id.toString();
                                        isection.iprofessor = section.Professor;
                                        isection.iyear = Number.parseInt(section.Year);
                                        if (section.hasOwnProperty("Section") && section.Section === "overall") {
                                            isection.iyear = 1900;
                                        }
                                        isection.icourse = section.Course;
                                        isection.ipass = section.Pass;
                                        isection.ifail = section.Fail;
                                        isection.iavg = section.Avg;
                                        isection.ititle = section.Title;
                                        isection.isubject = section.Subject;
                                        dataset.pushelements = isection;
                                        insightDataset.numRows++;
                                        if (!courses.includes(course)) {
                                            courses.push(course);
                                        }
                                    }
                                }
                            }
                            catch (e) {
                                global.console.log("~");
                            }
                        }
                        if (courses.length < 1) {
                            return reject(new IInsightFacade_1.InsightError("no valid course section"));
                        }
                        ids.push(id);
                        localClass.datasets.push(dataset);
                        localClass.insightDatasets.push(insightDataset);
                        if (!fs.existsSync("./data")) {
                            fs.mkdirSync("./data");
                        }
                        fs.writeFileSync("./data/datasets_" + id + ".txt", JSON.stringify(dataset));
                        resolve(ids);
                    });
                });
            }
            if (kind === IInsightFacade_1.InsightDatasetKind.Rooms) {
                global.console.log("I'm here 1");
                zip.loadAsync(content, { base64: true }).catch(function () {
                    return reject(new IInsightFacade_1.InsightError("Not a valid zip file1"));
                }).then(function (result1) {
                    result1.file("index.htm").async("text").then(function (result2) {
                        let htmlArray = [];
                        try {
                            let json = parse5.parse(result2);
                            localClass.htmlRecursion(json, htmlArray);
                            for (let html of htmlArray) {
                                promises.push(result1.file(html.substring(2, html.length)).async("text"));
                            }
                            Promise.all(promises).then(function (files) {
                                let insertedRooms = [];
                                let index = files.length;
                                for (const file of files) {
                                    let building;
                                    let rooms = [];
                                    let lat = null;
                                    let lon = null;
                                    building = parse5.parse(file);
                                    let buildingData = [];
                                    if (buildingData.length > 1) {
                                        continue;
                                    }
                                    localClass.parseBuilding(building, buildingData);
                                    let buildingaddress = buildingData[0].address;
                                    let url = "http://cs310.ugrad.cs.ubc.ca:11316/api/v1/project_c5n0b_w4u0b/";
                                    let encodedAddress = encodeURIComponent(buildingaddress);
                                    url = url + encodedAddress;
                                    let response = localClass.handleGeo(url);
                                    response.then(function (latlon) {
                                        index--;
                                        if (!(latlon instanceof Error)) {
                                            lat = latlon.lat1;
                                            lon = latlon.lon1;
                                        }
                                        localClass.parseRoom(building, rooms);
                                        for (let room of rooms) {
                                            room.ifullname = buildingData[0].fullname;
                                            room.iaddress = buildingData[0].address;
                                        }
                                        if (lat !== null && lon !== null) {
                                            for (let room of rooms) {
                                                room.ilat = lat;
                                                room.ilon = lon;
                                                if (room.giaddress !== null && room.ginumber !== null &&
                                                    room.gishortname !== null && room.gihref !== null &&
                                                    room.gifullname !== null && room.gifurniture !== null &&
                                                    room.gilat !== null && room.gilon !== null &&
                                                    room.giname !== null && room.gitype !== null &&
                                                    room.giseats !== null) {
                                                    dataset.pushelements = room;
                                                    insightDataset.numRows++;
                                                    if (!insertedRooms.includes(room)) {
                                                        insertedRooms.push(room);
                                                    }
                                                }
                                            }
                                        }
                                        if (index === 0) {
                                            if (insertedRooms.length < 1) {
                                                return reject(new IInsightFacade_1.InsightError("no valid room"));
                                            }
                                            ids.push(id);
                                            localClass.datasets.push(dataset);
                                            localClass.insightDatasets.push(insightDataset);
                                            if (!fs.existsSync("./data")) {
                                                fs.mkdirSync("./data");
                                            }
                                            fs.writeFileSync("./data/datasets_" + id + ".txt", JSON.stringify(dataset));
                                            resolve(ids);
                                        }
                                    });
                                }
                            });
                        }
                        catch (e) {
                            return reject(e);
                        }
                    });
                });
            }
        }).catch(function (err) {
            throw new IInsightFacade_1.InsightError(err);
        }).then(function (strs) {
            global.console.log(insightDataset.numRows);
            return ids;
        });
    }
    htmlRecursion(json, htmlArray) {
        if (json.hasOwnProperty("tagName") && json.hasOwnProperty("attrs") &&
            json.attrs.length > 0 && json.attrs[0].hasOwnProperty("name") &&
            json.attrs[0].hasOwnProperty("value")) {
            if (json.tagName === "a" && json.attrs[0].name === "href" && json.attrs[0].value.startsWith("./campus")) {
                if (!htmlArray.includes(json.attrs[0].value)) {
                    htmlArray.push(json.attrs[0].value);
                }
                return;
            }
        }
        if (!json.hasOwnProperty("childNodes")) {
            return;
        }
        for (let child of json.childNodes) {
            this.htmlRecursion(child, htmlArray);
        }
        return;
    }
    parseBuilding(html, buildingData) {
        if (html.hasOwnProperty("tagName") && html.tagName === "div" && html.hasOwnProperty("attrs") &&
            html.attrs.length > 0 && html.attrs[0].hasOwnProperty("value") &&
            html.attrs[0].value === "building-info") {
            let fullname1 = html.childNodes[1].childNodes[0].childNodes[0].value;
            let address1 = html.childNodes[3].childNodes[0].childNodes[0].value;
            let data = {
                fullname: fullname1,
                address: address1
            };
            buildingData.push(data);
            return;
        }
        if (!html.hasOwnProperty("childNodes")) {
            return;
        }
        for (let child of html.childNodes) {
            this.parseBuilding(child, buildingData);
        }
        return;
    }
    parseRoom(html, rooms) {
        if (html.hasOwnProperty("tagName") && html.tagName === "tr" && html.hasOwnProperty("childNodes") &&
            html.childNodes.length > 1 && html.childNodes[1].hasOwnProperty("tagName") &&
            html.childNodes[1].tagName === "td" && html.childNodes[1].hasOwnProperty("attrs") &&
            html.childNodes[1].attrs.length > 0 && html.childNodes[1].attrs[0].hasOwnProperty("value") &&
            html.childNodes[1].attrs[0].value === "views-field views-field-field-room-number") {
            let newRoom = new IRoom_1.IRoom();
            newRoom.ihref = html.childNodes[1].childNodes[1].attrs[0].value;
            newRoom.inumber = html.childNodes[1].childNodes[1].childNodes[0].value;
            newRoom.iseats = Number(html.childNodes[3].childNodes[0].value.substring(13, html.childNodes[3].childNodes[0].value.length - 10));
            newRoom.ifurniture = html.childNodes[5].childNodes[0].value.substring(13, html.childNodes[5].childNodes[0].value.length - 10);
            newRoom.itype = html.childNodes[7].childNodes[0].value.substring(13, html.childNodes[7].childNodes[0].value.length - 10);
            let splits = newRoom.gihref.split("/");
            let segment = splits[splits.length - 1];
            newRoom.ishortname = segment.substring(0, segment.length - (newRoom.ginumber.length + 1));
            newRoom.iname = newRoom.gishortname + "_" + newRoom.ginumber;
            rooms.push(newRoom);
            return;
        }
        if (!html.hasOwnProperty("childNodes")) {
            return;
        }
        for (let child of html.childNodes) {
            this.parseRoom(child, rooms);
        }
        return;
    }
    handleGeo(url) {
        let lat = 0;
        let lon = 0;
        return new Promise((resolve, reject) => {
            http.get(url, function (res) {
                let data = "";
                res.on("error", function (err) {
                    return reject(err);
                });
                res.on("data", function (d) {
                    data += d;
                });
                res.on("end", function () {
                    let parsed = JSON.parse(data);
                    lat = parsed.lat;
                    lon = parsed.lon;
                    resolve({ lat1: lat, lon1: lon });
                });
            });
        });
    }
    removeDataset(id) {
        return new Promise((resolve, reject) => {
            if (id === "") {
                return reject(new IInsightFacade_1.NotFoundError("Empty id to delete"));
            }
            if (id === undefined || id === null) {
                return reject(new IInsightFacade_1.InsightError("Empty id to delete"));
            }
            let index = 0;
            while (index < this.insightDatasets.length && this.insightDatasets[index].id !== id) {
                index++;
            }
            if (index === (this.insightDatasets.length)) {
                return reject(new IInsightFacade_1.NotFoundError("No such dataset"));
            }
            this.datasets.splice(index, 1);
            this.insightDatasets.splice(index, 1);
            this.ids.splice(index, 1);
            return resolve(id);
        }).catch(function (err) {
            if (err instanceof IInsightFacade_1.NotFoundError) {
                throw new IInsightFacade_1.NotFoundError(err);
            }
            else {
                throw new IInsightFacade_1.InsightError(err);
            }
        }).then(function (result) {
            fs.writeFileSync("./data/datasets_" + id + ".txt", "");
            return result;
        });
    }
    performQuery(query) {
        let local = this;
        return new Promise((resolve, reject) => {
            let result;
            if ((!query.hasOwnProperty("WHERE")) || (!query.hasOwnProperty("OPTIONS"))) {
                return reject(new IInsightFacade_1.InsightError("Invalid query"));
            }
            if ((!query.OPTIONS.hasOwnProperty("COLUMNS")) || query.OPTIONS.COLUMNS == null) {
                return reject(new IInsightFacade_1.InsightError("Incorrect file"));
            }
            let where = query.WHERE;
            let options = query.OPTIONS;
            let kind = IInsightFacade_1.InsightDatasetKind.Courses;
            try {
                let id = null;
                if (query.hasOwnProperty("TRANSFORMATIONS")) {
                    let applyrule = query.TRANSFORMATIONS.APPLY[0];
                    let applykey = Object.values(applyrule)[0];
                    id = Object.values(applykey)[0].split("_")[0];
                }
                else {
                    id = options.COLUMNS[0].split("_")[0];
                }
                if (id === null) {
                    return reject(new IInsightFacade_1.InsightError("No such dataset"));
                }
                for (let dataset of this.datasets) {
                    if (dataset.iid === id) {
                        kind = dataset.ikind;
                    }
                }
                if (Object.keys(where).length > 1) {
                    return reject(new IInsightFacade_1.InsightError("Invalid where"));
                }
                if (Object.keys(where).length === 0) {
                    for (let dataset of this.datasets) {
                        if (dataset.iid === id) {
                            if (dataset.ikind === IInsightFacade_1.InsightDatasetKind.Courses) {
                                result = this.numberTodataset(InsightFacade.datasetTonumber(dataset), id).ielements;
                            }
                            else {
                                result = this.stringTodataset(InsightFacade.datasetTostring(dataset), id).ielements;
                            }
                        }
                    }
                }
                else {
                    if (kind === "courses") {
                        result = this.numberTodataset(this.parsewhere(where, id), id).ielements;
                    }
                    if (kind === "rooms") {
                        let str = this.parsewhere(where, id);
                        result = this.stringTodataset(str, id).ielements;
                    }
                }
                if (query.hasOwnProperty("TRANSFORMATIONS")) {
                    let resultarray = [];
                    resultarray.push(result);
                    let transformations = query.TRANSFORMATIONS;
                    result = this.parseTransformations(transformations, resultarray, id);
                }
                if (options.hasOwnProperty("ORDER") && options.hasOwnProperty("COLUMNS")) {
                    if (Object.keys(options.ORDER).length < 2 && !options.COLUMNS.includes(options.ORDER)) {
                        return reject(new IInsightFacade_1.InsightError("Order is not in Column"));
                    }
                    if (Object.keys(options).length > 2) {
                        return reject(new IInsightFacade_1.InsightError("Invalid Options"));
                    }
                    else {
                        result = this.ielementsToColumns(options.COLUMNS, result, options.ORDER, id);
                    }
                }
                else if (Object.keys(options).length === 1 && options.hasOwnProperty("COLUMNS")) {
                    result = this.ielementsToColumns(options.COLUMNS, result, null, id);
                }
                else {
                    return reject(new IInsightFacade_1.InsightError("Invalid Option field"));
                }
                if (result.length > 5000) {
                    return reject(new IInsightFacade_1.InsightError("Too much"));
                }
            }
            catch (e) {
                return reject(new IInsightFacade_1.InsightError(e));
            }
            return resolve(result);
        }).catch((err) => {
            throw new IInsightFacade_1.InsightError(err);
        }).then((res) => {
            return res;
        });
    }
    parseTransformations(trans, res, id) {
        let result = null;
        if (Object.keys(trans).length !== 2 && trans.hasOwnProperty("GROUP") && trans.hasOwnProperty("APPLY")) {
            throw new IInsightFacade_1.InsightError("Invalid keys in Transformations");
        }
        const group = trans.GROUP;
        const apply = trans.APPLY;
        result = this.parseGroup(group, res, id);
        result = this.parseApply(group, result, apply, id);
        return result;
    }
    parseGroup(group, res, id) {
        if (group.length < 1) {
            return res;
        }
        let groupKey = group[0];
        let result = [];
        for (let rGroup of res) {
            let resultMap = new Map();
            for (let element of rGroup) {
                if (!resultMap.has(element.get(groupKey))) {
                    resultMap.set(element.get(groupKey), [element]);
                }
                else {
                    let a = resultMap.get(element.get(groupKey));
                    a.push(element);
                    resultMap.set(element.get(groupKey), a);
                }
            }
            for (let value of resultMap.values()) {
                result.push(value);
            }
        }
        const restGroup = Object.assign([], group);
        restGroup.splice(0, 1);
        return this.parseGroup(restGroup, result, id);
    }
    parseApply(group, res, apply, id) {
        let result = [];
        let checkapplykeys = [];
        for (let applyrule of apply) {
            let applyKey1 = Object.keys(applyrule)[0];
            if (checkapplykeys.includes(applyKey1)) {
                throw new IInsightFacade_1.InsightError("applyKey should be unique");
            }
            else {
                checkapplykeys.push(applyKey1);
            }
        }
        try {
            for (let elements of res) {
                let alterElement = {};
                for (let groupKey of group) {
                    alterElement[groupKey] = elements[0].get(groupKey);
                }
                global.console.log(alterElement);
                for (let applyRule of apply) {
                    let applyKey = Object.keys(applyRule)[0];
                    let applyTokenStr = applyRule[applyKey];
                    let resNum = null;
                    if (applyTokenStr.hasOwnProperty("MAX")) {
                        let applytoken = new ApplyToken_1.ApplyToken(ApplyToken_1.Applytoken.MAX);
                        resNum = applytoken.applyOperation(elements, applyTokenStr.MAX);
                    }
                    if (applyTokenStr.hasOwnProperty("MIN")) {
                        let applytoken = new ApplyToken_1.ApplyToken(ApplyToken_1.Applytoken.MIN);
                        resNum = applytoken.applyOperation(elements, applyTokenStr.MIN);
                    }
                    if (applyTokenStr.hasOwnProperty("AVG")) {
                        let applytoken = new ApplyToken_1.ApplyToken(ApplyToken_1.Applytoken.AVG);
                        resNum = applytoken.applyOperation(elements, applyTokenStr.AVG);
                    }
                    if (applyTokenStr.hasOwnProperty("COUNT")) {
                        let applytoken = new ApplyToken_1.ApplyToken(ApplyToken_1.Applytoken.COUNT);
                        resNum = applytoken.applyOperation(elements, applyTokenStr.COUNT);
                    }
                    if (applyTokenStr.hasOwnProperty("SUM")) {
                        let applytoken = new ApplyToken_1.ApplyToken(ApplyToken_1.Applytoken.SUM);
                        resNum = applytoken.applyOperation(elements, applyTokenStr.SUM);
                    }
                    if (resNum === null) {
                        throw new IInsightFacade_1.InsightError("invalid applyToken");
                    }
                    if (applyKey.includes("_")) {
                        throw new IInsightFacade_1.InsightError("applyKey shouldn't have _");
                    }
                    alterElement[applyKey] = resNum;
                }
                result.push(alterElement);
            }
        }
        catch (e) {
            throw new IInsightFacade_1.InsightError(e);
        }
        return result;
    }
    parsewhere(where, id) {
        let kind = IInsightFacade_1.InsightDatasetKind.Courses;
        let findDataset = false;
        for (let dataset of this.datasets) {
            if (dataset.iid === id) {
                kind = dataset.ikind;
                findDataset = true;
            }
        }
        if (!findDataset) {
            throw new IInsightFacade_1.InsightError("No such dataset");
        }
        if (where.hasOwnProperty("AND")) {
            let parsingData = [];
            if (Object.keys(where.AND[0]).length < 1) {
                throw new IInsightFacade_1.InsightError("invalid AND");
            }
            for (let str of where.AND) {
                parsingData.push(this.parsewhere(str, id));
            }
            let logic;
            logic = new logicComparison_1.LogicComparison(logicComparison_1.Logic.And, parsingData);
            return logic.parseLogic();
        }
        if (where.hasOwnProperty("OR")) {
            global.console.log("OR");
            let parsingData = [];
            if (Object.keys(where.OR[0]).length < 1) {
                throw new IInsightFacade_1.InsightError("invalid OR");
            }
            for (let str of where.OR) {
                parsingData.push(this.parsewhere(str, id));
            }
            let logic;
            logic = new logicComparison_1.LogicComparison(logicComparison_1.Logic.Or, parsingData);
            return logic.parseLogic();
        }
        if (where.hasOwnProperty("LT")) {
            global.console.log("LT");
            let dataset = new IDataSet_1.IDataSet();
            let ikey = null;
            let value = 0;
            let result;
            if (Object.keys(where.LT).length !== 1) {
                throw new IInsightFacade_1.InsightError("invalid LT");
            }
            for (let datas of this.datasets) {
                if (datas.iid === id) {
                    for (let sec of datas.ielements) {
                        dataset.pushelements = sec;
                    }
                    dataset.iid = id;
                    dataset.setkind = datas.ikind;
                }
            }
            if (where.LT.hasOwnProperty(id + "_avg")) {
                ikey = key_1.key.avg;
                if (where.LT[id + "_avg"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.LT[id + "_avg"];
            }
            if (where.LT.hasOwnProperty(id + "_pass")) {
                ikey = key_1.key.pass;
                if (where.LT[id + "_pass"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.LT[id + "_pass"];
            }
            if (where.LT.hasOwnProperty(id + "_fail")) {
                ikey = key_1.key.fail;
                if (where.LT[id + "_fail"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.LT[id + "_fail"];
            }
            if (where.LT.hasOwnProperty(id + "_audit")) {
                ikey = key_1.key.audit;
                if (where.LT[id + "_audit"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.LT[id + "_audit"];
            }
            if (where.LT.hasOwnProperty(id + "_year")) {
                ikey = key_1.key.year;
                if (where.LT[id + "_year"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.LT[id + "_year"];
            }
            if (where.LT.hasOwnProperty(id + "_lat")) {
                ikey = key_1.key.lat;
                if (where.LT[id + "_lat"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.LT[id + "_lat"];
            }
            if (where.LT.hasOwnProperty(id + "_lon")) {
                ikey = key_1.key.lon;
                if (where.LT[id + "_lon"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.LT[id + "_lon"];
            }
            if (where.LT.hasOwnProperty(id + "_seats")) {
                ikey = key_1.key.seats;
                if (where.LT[id + "_seats"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.LT[id + "_seats"];
            }
            if (ikey === null) {
                throw new IInsightFacade_1.InsightError("Invalid key");
            }
            if (isNaN(value) || value === undefined || value === null || ((typeof value === "string" &&
                (value.length === 0 || value.includes(" ")))) || (typeof value !== "string" &&
                typeof value !== "number")) {
                throw new IInsightFacade_1.InsightError("invalid value");
            }
            let mc = new MComparison_1.MComparison(MComparison_1.MComparator.Lt, ikey, value);
            let parsedata = mc.parseM(dataset);
            if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
                result = InsightFacade.datasetTonumber(parsedata);
            }
            else {
                result = InsightFacade.datasetTostring(parsedata);
            }
            return result;
        }
        if (where.hasOwnProperty("GT")) {
            global.console.log("GT");
            let dataset = new IDataSet_1.IDataSet();
            let ikey = null;
            let value = 0;
            let result;
            if (Object.keys(where.GT).length !== 1) {
                throw new IInsightFacade_1.InsightError("invalid GT");
            }
            for (let datas of this.datasets) {
                if (datas.iid === id) {
                    for (let sec of datas.ielements) {
                        dataset.pushelements = sec;
                    }
                    dataset.iid = id;
                    dataset.setkind = datas.ikind;
                }
            }
            if (where.GT.hasOwnProperty(id + "_avg")) {
                ikey = key_1.key.avg;
                if (where.GT[id + "_avg"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.GT[id + "_avg"];
            }
            if (where.GT.hasOwnProperty(id + "_pass")) {
                ikey = key_1.key.pass;
                if (where.GT[id + "_pass"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.GT[id + "_pass"];
            }
            if (where.GT.hasOwnProperty(id + "_fail")) {
                ikey = key_1.key.fail;
                if (where.GT[id + "_fail"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.GT[id + "_fail"];
            }
            if (where.GT.hasOwnProperty(id + "_audit")) {
                ikey = key_1.key.audit;
                if (where.GT[id + "_audit"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.GT[id + "_audit"];
            }
            if (where.GT.hasOwnProperty(id + "_year")) {
                ikey = key_1.key.year;
                if (where.GT[id + "_year"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.GT[id + "_year"];
            }
            if (where.GT.hasOwnProperty(id + "_lat")) {
                ikey = key_1.key.lat;
                if (where.GT[id + "_lat"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.GT[id + "_lat"];
            }
            if (where.GT.hasOwnProperty(id + "_lon")) {
                ikey = key_1.key.lon;
                if (where.GT[id + "_lon"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.GT[id + "_lon"];
            }
            if (where.GT.hasOwnProperty(id + "_seats")) {
                ikey = key_1.key.seats;
                if (where.GT[id + "_seats"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.GT[id + "_seats"];
            }
            if (ikey === null) {
                throw new IInsightFacade_1.InsightError("Invalid key");
            }
            if (isNaN(value) || value === undefined || value === null || ((typeof value === "string" &&
                (value.length === 0 || value.includes(" ")))) || (typeof value !== "string" &&
                typeof value !== "number")) {
                global.console.log("throw here!!");
                throw new IInsightFacade_1.InsightError("invalid value");
            }
            let mc = new MComparison_1.MComparison(MComparison_1.MComparator.Gt, ikey, value);
            let parsedata = mc.parseM(dataset);
            if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
                result = InsightFacade.datasetTonumber(parsedata);
            }
            else {
                result = InsightFacade.datasetTostring(parsedata);
            }
            return result;
        }
        if (where.hasOwnProperty("EQ")) {
            global.console.log("EQ");
            let dataset = new IDataSet_1.IDataSet();
            let ikey = null;
            let value;
            let result;
            if (Object.keys(where.EQ).length !== 1) {
                throw new IInsightFacade_1.InsightError("invalid EQ");
            }
            for (let datas of this.datasets) {
                if (datas.iid === id) {
                    for (let sec of datas.ielements) {
                        dataset.pushelements = sec;
                    }
                    dataset.iid = id;
                    dataset.setkind = datas.ikind;
                }
            }
            if (where.EQ.hasOwnProperty(id + "_avg")) {
                ikey = key_1.key.avg;
                if (where.EQ[id + "_avg"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.EQ[id + "_avg"];
            }
            if (where.EQ.hasOwnProperty(id + "_pass")) {
                ikey = key_1.key.pass;
                if (where.EQ[id + "_pass"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.EQ[id + "_pass"];
            }
            if (where.EQ.hasOwnProperty(id + "_fail")) {
                ikey = key_1.key.fail;
                if (where.EQ[id + "_fail"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.EQ[id + "_fail"];
            }
            if (where.EQ.hasOwnProperty(id + "_audit")) {
                ikey = key_1.key.audit;
                if (where.EQ[id + "_audit"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.EQ[id + "_audit"];
            }
            if (where.EQ.hasOwnProperty(id + "_year")) {
                ikey = key_1.key.year;
                if (where.EQ[id + "_year"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.EQ[id + "_year"];
            }
            if (where.EQ.hasOwnProperty(id + "_lat")) {
                ikey = key_1.key.lat;
                if (where.EQ[id + "_lat"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.EQ[id + "_lat"];
            }
            if (where.EQ.hasOwnProperty(id + "_lon")) {
                ikey = key_1.key.lon;
                if (where.EQ[id + "_lon"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.EQ[id + "_lon"];
            }
            if (where.EQ.hasOwnProperty(id + "_seats")) {
                ikey = key_1.key.seats;
                if (where.EQ[id + "_seats"] === []) {
                    throw new IInsightFacade_1.InsightError("invalid value");
                }
                value = where.EQ[id + "_seats"];
            }
            if (ikey === null) {
                throw new IInsightFacade_1.InsightError("Invalid key");
            }
            if (isNaN(value) || value === undefined || value === null || !(typeof value === "number")) {
                throw new IInsightFacade_1.InsightError("invalid value");
            }
            try {
                let mc = new MComparison_1.MComparison(MComparison_1.MComparator.Eq, ikey, value);
                let parsedata = mc.parseM(dataset);
                if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
                    result = InsightFacade.datasetTonumber(parsedata);
                }
                else {
                    result = InsightFacade.datasetTostring(parsedata);
                }
            }
            catch (e) {
                throw new IInsightFacade_1.InsightError(e);
            }
            return result;
        }
        if (where.hasOwnProperty("IS")) {
            global.console.log("IS");
            let dataset = new IDataSet_1.IDataSet();
            let ikey = null;
            let value = "";
            let result;
            if (Object.keys(where.IS).length !== 1) {
                throw new IInsightFacade_1.InsightError("invalid IS");
            }
            for (let datas of this.datasets) {
                if (datas.iid === id) {
                    for (let sec of datas.ielements) {
                        dataset.pushelements = sec;
                    }
                    dataset.iid = id;
                    dataset.setkind = datas.ikind;
                }
            }
            if (where.IS.hasOwnProperty(id + "_dept")) {
                ikey = key_1.key.subject;
                value = where.IS[id + "_dept"];
            }
            if (where.IS.hasOwnProperty(id + "_id")) {
                ikey = key_1.key.course;
                value = where.IS[id + "_id"];
            }
            if (where.IS.hasOwnProperty(id + "_instructor")) {
                ikey = key_1.key.prof;
                value = where.IS[id + "_instructor"];
            }
            if (where.IS.hasOwnProperty(id + "_title")) {
                ikey = key_1.key.title;
                value = where.IS[id + "_title"];
            }
            if (where.IS.hasOwnProperty(id + "_uuid")) {
                ikey = key_1.key.id;
                value = where.IS[id + "_uuid"];
            }
            if (where.IS.hasOwnProperty(id + "_fullname")) {
                ikey = key_1.key.fullname;
                value = where.IS[id + "_fullname"];
            }
            if (where.IS.hasOwnProperty(id + "_shortname")) {
                ikey = key_1.key.shortname;
                value = where.IS[id + "_shortname"];
            }
            if (where.IS.hasOwnProperty(id + "_name")) {
                ikey = key_1.key.name;
                value = where.IS[id + "_name"];
            }
            if (where.IS.hasOwnProperty(id + "_number")) {
                ikey = key_1.key.number;
                value = where.IS[id + "_number"];
            }
            if (where.IS.hasOwnProperty(id + "_address")) {
                ikey = key_1.key.address;
                value = where.IS[id + "_address"];
            }
            if (where.IS.hasOwnProperty(id + "_type")) {
                ikey = key_1.key.type;
                value = where.IS[id + "_type"];
            }
            if (where.IS.hasOwnProperty(id + "_furniture")) {
                ikey = key_1.key.furniture;
                value = where.IS[id + "_furniture"];
            }
            if (where.IS.hasOwnProperty(id + "_href")) {
                ikey = key_1.key.href;
                value = where.IS[id + "_href"];
            }
            if (ikey === null) {
                throw new IInsightFacade_1.InsightError("Invalid key");
            }
            if (value === null || value === undefined || !(typeof value === "string")) {
                throw new IInsightFacade_1.InsightError("invalid value");
            }
            try {
                let mc = new SComparison_1.SComparison(ikey, value);
                let parsedata = mc.parseS(dataset);
                if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
                    result = InsightFacade.datasetTonumber(parsedata);
                }
                else {
                    result = InsightFacade.datasetTostring(parsedata);
                }
            }
            catch (e) {
                throw new IInsightFacade_1.InsightError(e);
            }
            return result;
        }
        if (where.hasOwnProperty("NOT")) {
            global.console.log("NOT");
            let result;
            if (Object.keys(where.NOT).length !== 1) {
                throw new IInsightFacade_1.InsightError("invalid NOT");
            }
            try {
                if (where.NOT.hasOwnProperty("NOT")) {
                    result = this.parsewhere(where.NOT.NOT, id);
                    return result;
                }
                let allUUID = [];
                for (let dataset1 of this.datasets) {
                    if (dataset1.iid === id) {
                        if (kind === IInsightFacade_1.InsightDatasetKind.Courses) {
                            allUUID = InsightFacade.datasetTonumber(dataset1);
                        }
                        else {
                            allUUID = InsightFacade.datasetTostring(dataset1);
                        }
                    }
                }
                result = Negation_1.Negation.parseN(this.parsewhere(where.NOT, id), allUUID);
            }
            catch (e) {
                throw new IInsightFacade_1.InsightError(e);
            }
            return result;
        }
        throw new IInsightFacade_1.InsightError("Empty field");
    }
    static datasetTonumber(dataset) {
        let result = [];
        for (let section of dataset.ielements) {
            result.push(Number(section.giid));
        }
        return result;
    }
    static datasetTostring(dataset) {
        let result = [];
        for (let room of dataset.ielements) {
            result.push(room.giname);
        }
        return result;
    }
    numberTodataset(values, id) {
        let result = new IDataSet_1.IDataSet();
        let map = new Map();
        for (let dataset of this.datasets) {
            if (dataset.iid === id) {
                for (let section of dataset.ielements) {
                    map.set(Number(section.giid), section);
                }
            }
        }
        for (let value of values) {
            result.pushelements = map.get(value);
        }
        result.iid = id;
        return result;
    }
    stringTodataset(values, id) {
        let result = new IDataSet_1.IDataSet();
        let map = new Map();
        for (let dataset of this.datasets) {
            if (dataset.iid === id) {
                for (let room of dataset.ielements) {
                    map.set(room.giname, room);
                }
            }
        }
        for (let value of values) {
            result.pushelements = map.get(value);
        }
        result.iid = id;
        return result;
    }
    ielementsToColumns(str, ielements, order, id) {
        let result = [];
        for (let ielement of ielements) {
            let obj = {};
            if (ielement instanceof ISection_1.ISection) {
                for (let key1 of str) {
                    switch (key1.toString()) {
                        case id + "_dept": {
                            obj[id + "_dept"] = ielement.gisubject;
                            break;
                        }
                        case id + "_id": {
                            obj[id + "_id"] = ielement.gicourse;
                            break;
                        }
                        case id + "_avg": {
                            obj[id + "_avg"] = ielement.giavg;
                            break;
                        }
                        case id + "_instructor": {
                            obj[id + "_instructor"] = ielement.giprofessor;
                            break;
                        }
                        case id + "_title": {
                            obj[id + "_title"] = ielement.gititle;
                            break;
                        }
                        case id + "_pass": {
                            obj[id + "_pass"] = ielement.gipass;
                            break;
                        }
                        case id + "_fail": {
                            obj[id + "_fail"] = ielement.gifail;
                            break;
                        }
                        case id + "_audit": {
                            obj[id + "_audit"] = ielement.giaudit;
                            break;
                        }
                        case id + "_uuid": {
                            obj[id + "_uuid"] = ielement.giid;
                            break;
                        }
                        case id + "_year": {
                            obj[id + "_year"] = ielement.giyear;
                            break;
                        }
                        default: {
                            throw new IInsightFacade_1.InsightError("No such key");
                        }
                    }
                }
            }
            else if (ielement instanceof IRoom_1.IRoom) {
                for (let key1 of str) {
                    switch (key1.toString()) {
                        case id + "_fullname": {
                            obj[id + "_fullname"] = ielement.gifullname;
                            break;
                        }
                        case id + "_shortname": {
                            obj[id + "_shortname"] = ielement.gishortname;
                            break;
                        }
                        case id + "_number": {
                            obj[id + "_number"] = ielement.ginumber;
                            break;
                        }
                        case id + "_name": {
                            obj[id + "_name"] = ielement.giname;
                            break;
                        }
                        case id + "_address": {
                            obj[id + "_address"] = ielement.giaddress;
                            break;
                        }
                        case id + "_lat": {
                            obj[id + "_lat"] = ielement.gilat;
                            break;
                        }
                        case id + "_lon": {
                            obj[id + "_lon"] = ielement.gilon;
                            break;
                        }
                        case id + "_seats": {
                            obj[id + "_seats"] = ielement.giseats;
                            break;
                        }
                        case id + "_type": {
                            obj[id + "_type"] = ielement.gitype;
                            break;
                        }
                        case id + "_furniture": {
                            obj[id + "_furniture"] = ielement.gifurniture;
                            break;
                        }
                        case id + "_href": {
                            obj[id + "_href"] = ielement.gihref;
                            break;
                        }
                        default: {
                            throw new IInsightFacade_1.InsightError("No such key");
                        }
                    }
                }
            }
            else {
                for (let key1 of str) {
                    if (!ielement.hasOwnProperty(key1)) {
                        throw new IInsightFacade_1.InsightError("elements in columns not in group or apply");
                    }
                    obj[key1] = ielement[key1];
                }
            }
            result.push(obj);
        }
        if (order == null) {
            return result;
        }
        return result.sort((a, b) => {
            if (order.hasOwnProperty("dir") && order.hasOwnProperty("keys")) {
                let sortOrder = -1;
                if (order.dir === "DOWN") {
                    sortOrder = 1;
                }
                for (let orderkey of order.keys) {
                    if (!str.includes(orderkey)) {
                        throw new IInsightFacade_1.InsightError("key not in columns");
                    }
                    if (a[orderkey] < b[orderkey]) {
                        return sortOrder;
                    }
                    if (a[orderkey] > b[orderkey]) {
                        return -sortOrder;
                    }
                }
                return 0;
            }
            else {
                if (!str.includes(order)) {
                    throw new IInsightFacade_1.InsightError("key not in columns");
                }
                switch (order) {
                    case id + "_dept": {
                        if (a[id + "_dept"] < b[id + "_dept"]) {
                            return -1;
                        }
                        if (a[id + "_dept"] > b[id + "_dept"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_id": {
                        if (a[id + "_id"] < b[id + "_id"]) {
                            return -1;
                        }
                        if (a[id + "_id"] > b[id + "_id"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_avg": {
                        if (a[id + "_avg"] < b[id + "_avg"]) {
                            return -1;
                        }
                        if (a[id + "_avg"] > b[id + "_avg"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_instructor": {
                        if (a[id + "_instructor"] < b[id + "_instructor"]) {
                            return -1;
                        }
                        if (a[id + "_instructor"] > b[id + "_instructor"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_title": {
                        if (a[id + "_title"] < b[id + "_title"]) {
                            return -1;
                        }
                        if (a[id + "_title"] > b[id + "_title"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_pass": {
                        if (a[id + "_pass"] < b[id + "_pass"]) {
                            return -1;
                        }
                        if (a[id + "_pass"] > b[id + "_pass"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_fail": {
                        if (a[id + "_fail"] < b[id + "_fail"]) {
                            return -1;
                        }
                        if (a[id + "_fail"] > b[id + "_fail"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_audit": {
                        if (a[id + "_audit"] < b[id + "_audit"]) {
                            return -1;
                        }
                        if (a[id + "_audit"] > b[id + "_audit"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_uuid": {
                        if (a[id + "_uuid"] < b[id + "_uuid"]) {
                            return -1;
                        }
                        if (a[id + "_uuid"] > b[id + "_uuid"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_year": {
                        if (a[id + "_year"] < b[id + "_year"]) {
                            return -1;
                        }
                        if (a[id + "_year"] > b[id + "_year"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_fullname": {
                        if (a[id + "_fullname"] < b[id + "_fullname"]) {
                            return -1;
                        }
                        if (a[id + "_fullname"] > b[id + "_fullname"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_shortname": {
                        if (a[id + "_shortname"] < b[id + "_shortname"]) {
                            return -1;
                        }
                        if (a[id + "_shortname"] > b[id + "_shortname"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_number": {
                        if (a[id + "_number"] < b[id + "_number"]) {
                            return -1;
                        }
                        if (a[id + "_number"] > b[id + "_number"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_name": {
                        if (a[id + "_name"] < b[id + "_name"]) {
                            return -1;
                        }
                        if (a[id + "_name"] > b[id + "_name"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_address": {
                        if (a[id + "_address"] < b[id + "_address"]) {
                            return -1;
                        }
                        if (a[id + "_address"] > b[id + "_address"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_lat": {
                        if (a[id + "_lat"] < b[id + "_lat"]) {
                            return -1;
                        }
                        if (a[id + "_lat"] > b[id + "_lat"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_lon": {
                        if (a[id + "_lon"] < b[id + "_lon"]) {
                            return -1;
                        }
                        if (a[id + "_lon"] > b[id + "_lon"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_seats": {
                        if (a[id + "_seats"] < b[id + "_seats"]) {
                            return -1;
                        }
                        if (a[id + "_seats"] > b[id + "_seats"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_type": {
                        if (a[id + "_type"] < b[id + "_type"]) {
                            return -1;
                        }
                        if (a[id + "_type"] > b[id + "_tyoe"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_furniture": {
                        if (a[id + "_furniture"] < b[id + "_furniture"]) {
                            return -1;
                        }
                        if (a[id + "_furniture"] > b[id + "_furniture"]) {
                            return 1;
                        }
                        return 0;
                    }
                    case id + "_href": {
                        if (a[id + "_href"] < b[id + "_href"]) {
                            return -1;
                        }
                        if (a[id + "_href"] > b[id + "_href"]) {
                            return 1;
                        }
                        return 0;
                    }
                    default: {
                        global.console.log("here: " + order);
                        throw new IInsightFacade_1.InsightError("No such key");
                    }
                }
            }
        });
    }
    listDatasets() {
        return new Promise((resolve) => {
            resolve(this.insightDatasets);
        }).then((result) => {
            return (result);
        });
    }
}
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map