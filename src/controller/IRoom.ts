import {InsightError} from "./IInsightFacade";

export class IRoom {
    set ifullname(value: string) {
        this.fullname = value;
    }

    set ishortname(value: string) {
        this.shortname = value;
    }

    set ilat(value: number) {
        this.lat = value;
    }

    set ilon(value: number) {
        this.lon = value;
    }

    set iname(value: string) {
        this.name = value;
    }

    set iseats(value: number) {
        this.seats = value;
    }

    set inumber(value: string) {
        this.number = value;
    }

    set iaddress(value: string) {
        this.address = value;
    }

    set itype(value: string) {
        this.type = value;
    }

    set ifurniture(value: string) {
        this.furniture = value;
    }
    set ihref(value: string) {
        this.href = value;
    }
    get gifullname(): string {
        return this.fullname;
    }

    get gishortname(): string {
        return this.shortname;
    }

    get gilat(): number {
        return this.lat;
    }

    get gilon(): number {
        return this.lon;
    }

    get giname(): string {
        return this.name;
    }

    get giseats(): number {
        return this.seats;
    }

    get ginumber(): string {
        return this.number;
    }

    get giaddress(): string {
        return this.address;
    }

    get gitype(): string {
        return this.type;
    }

    get gifurniture(): string {
        return this.furniture;
    }
    get gihref(): string {
        return this.href;
    }
    private fullname: string;
    private shortname: string;
    private lat: number;
    private lon: number;
    private name: string;
    private seats: number;
    private number: string;
    private address: string;
    private type: string;
    private furniture: string;
    private href: string;
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
    public get(ikey: string): any {
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
                throw new InsightError("Invalid key in iRoom");
            }
        }
    }
    /*
    public isEqual(sec: ISection): boolean {
        return this.fullname === sec.gifullname && this.furniture === sec.gifurniture && this.type === sec.gitype
            && this.address === sec.giaddress && this.number === sec.ginumber && this.seats === sec.giseats &&
            this.name === sec.giname && this.lon === sec.gilon && this.shortname === sec.gishortname
            && this.lat === sec.gilat;
    }*/
}
