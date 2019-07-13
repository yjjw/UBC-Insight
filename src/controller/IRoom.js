"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("./IInsightFacade");
class IRoom {
    set ifullname(value) {
        this.fullname = value;
    }
    set ishortname(value) {
        this.shortname = value;
    }
    set ilat(value) {
        this.lat = value;
    }
    set ilon(value) {
        this.lon = value;
    }
    set iname(value) {
        this.name = value;
    }
    set iseats(value) {
        this.seats = value;
    }
    set inumber(value) {
        this.number = value;
    }
    set iaddress(value) {
        this.address = value;
    }
    set itype(value) {
        this.type = value;
    }
    set ifurniture(value) {
        this.furniture = value;
    }
    set ihref(value) {
        this.href = value;
    }
    get gifullname() {
        return this.fullname;
    }
    get gishortname() {
        return this.shortname;
    }
    get gilat() {
        return this.lat;
    }
    get gilon() {
        return this.lon;
    }
    get giname() {
        return this.name;
    }
    get giseats() {
        return this.seats;
    }
    get ginumber() {
        return this.number;
    }
    get giaddress() {
        return this.address;
    }
    get gitype() {
        return this.type;
    }
    get gifurniture() {
        return this.furniture;
    }
    get gihref() {
        return this.href;
    }
    constructor() {
        this.fullname = null;
        this.shortname = null;
        this.lat = null;
        this.lon = null;
        this.name = null;
        this.seats = null;
        this.number = null;
        this.address = null;
        this.type = null;
        this.furniture = null;
        this.href = null;
    }
    get(ikey) {
        let splits = ikey.split("_");
        let key = splits[1];
        switch (key) {
            case "fullname": {
                return this.fullname;
            }
            case "shortname": {
                return this.shortname;
            }
            case "number": {
                return this.number;
            }
            case "address": {
                return this.address;
            }
            case "lat": {
                return this.lat;
            }
            case "name": {
                return this.name;
            }
            case "lon": {
                return this.lon;
            }
            case "seats": {
                return this.seats;
            }
            case "type": {
                return this.type;
            }
            case "furniture": {
                return this.furniture;
            }
            case "href": {
                return this.href;
            }
            default: {
                throw new IInsightFacade_1.InsightError("Invalid key in iRoom");
            }
        }
    }
}
exports.IRoom = IRoom;
//# sourceMappingURL=IRoom.js.map