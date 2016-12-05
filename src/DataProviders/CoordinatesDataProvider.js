
class CoordinatesDataProvider {
    constructor({onFetch, showOnMap}){
        this._onFetch = onFetch;
        this.showSuggestion = false;
        this.showOnMap = showOnMap;
        this.showOnSelect = false;
        this.showOnEnter = true;
        this.fetch = this.fetch.bind(this);
        this.find = this.find.bind(this);
        this.rxLat = new RegExp('(\\d+\\.?\\d+)\\s*(N|S)');
        this.rxLng = new RegExp('(\\d+\\.?\\d+)\\s*(E|W)');
    }
    _parseCoordinates(value) {
        let coords = value.split(/(,|\\s+)/)
        .reduce((a,x) => {
            const lat = this.rxLat.exec(x);
            if(lat && lat.length) {
                a.lat = parseFloat(lat[1]);
                if (lat[2] == 'S'){
                    a.lat = -a.lat;
                }
            }
            const lng = this.rxLng.exec(x);
            if(lng && lng.length) {
                a.lng = parseFloat(lng[1]);
                if (lng[2] == 'W'){
                    a.lng = -a.lng;
                }
            }
            return a;
        },{});
        if (coords.hasOwnProperty('lat') && coords.hasOwnProperty('lng')){
            return {type: 'Point', coordinates: [coords.lng, coords.lat]};
        }
        else {
            return null;
        }
    }
    fetch (value){
        return new Promise(resolve => resolve([]));        
    }
    find(value, limit, strong, retrieveGeometry){
        let g = this._parseCoordinates(value);        
        return new Promise(resolve => {
            let result = {feature: { type: 'Feature', geometry: g, properties: {} }, provider: this, query: value};
            if (g && typeof this._onFetch === 'function'){
                this._onFetch(result);
            }             
            resolve(g ? [result] : []);
        });
    }
}

window.nsGmx = window.nsGmx || {};
window.nsGmx.CoordinatesDataProvider = CoordinatesDataProvider;

export { CoordinatesDataProvider };