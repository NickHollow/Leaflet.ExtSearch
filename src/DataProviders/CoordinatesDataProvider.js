import { EventTarget } from '../lib/EventTarget/src/EventTarget.js';

class CoordinatesDataProvider extends EventTarget {
    constructor(){
        super();        
        this.showSuggestion = false;        
        this.showOnSelect = false;
        this.showOnEnter = true;
        this.fetch = this.fetch.bind(this);
        this.find = this.find.bind(this);        

        this.rxF = new RegExp('^\\s*\\-?(\\d+(\\.\\d+)?)(\\s+[N|S])?(,\\s*|\\s+)\\-?(\\d+(\\.\\d+)?)(\\s+[E|W])?');
        this.rxD = new RegExp('^\\s*(\\d{1,2})[\\s|\\u00b0](\\d{1,2})[\\s|\\u0027](\\d{1,2}\\.\\d+)\\u0022?(\\s+[N|S])?,?\\s+(\\d{1,2})[\\s|\\u00b0](\\d{1,2})[\\s|\\u0027](\\d{1,2}\\.\\d+)\\u0022?(\\s+[E|W])?');
    }
    _parseCoordinates(value) {
        let m = this.rxD.exec(value);
        if (Array.isArray(m) && m.length === 9) {
            return this._parseDegrees ([m[1],m[2],m[3],m[5],m[6],m[7]].map(x => parseFloat(x)));
        }
        m = this.rxF.exec(value);
        if (Array.isArray (m) && m.length === 8){
            return {type: 'Point', coordinates: [
                parseFloat(m[5]),
                parseFloat(m[1])
            ]};
        }
        
        return null;               
    }
    _parseDegrees ([latDeg, latMin, latSec, lngDeg, lngMin, lngSec]) {    
        return {type: 'Point', coordinates: [
            lngDeg + lngMin / 60 + lngSec / 3600,
            latDeg + latMin / 60 + latSec / 3600
        ]};
    }
    fetch (value){
        return new Promise(resolve => resolve([]));
    }
    find(value, limit, strong, retrieveGeometry){        
        let g = this._parseCoordinates(value);        
        return new Promise(resolve => {
            let result = {feature: { type: 'Feature', geometry: g, properties: {} }, provider: this, query: value};
            if (g) {
                let event = document.createEvent('Event');
                event.initEvent('fetch', false, false);
                event.detail = result;
                this.dispatchEvent(event);
            }             
            resolve(g ? [result] : []);
        });
    }
}

export { CoordinatesDataProvider };