
class OsmDataProvider {
    constructor({serverBase, limit}){
        this._serverBase = serverBase;
        this._limit = limit;
        this.showSuggestion = true;        
        this.find = this.find.bind(this);
        this.fetch = this.fetch.bind(this);
        this._convertGeometry = this._convertGeometry.bind(this);

        this._key = window.KOSMOSNIMKI_SESSION_KEY == null || window.KOSMOSNIMKI_SESSION_KEY == 'INVALID' ? '' : `&key=${window.KOSMOSNIMKI_SESSION_KEY}`;
    }
    _convertGeometry(geometry) {        
        switch (geometry.type.toUpperCase()) {
            case 'POINT':
                geometry.type = 'Point';
                break;
            case 'POLYGON':
                geometry.type = 'Polygon';
                break;
            case 'MULTIPOLYGON':
                geometry.type = 'MultiPolygon';
                break;
            case 'LINESTRING':
            case 'POLYLINE':
                geometry.type = 'LineString';
                break;
            case 'MULTILINESTRING':
                geometry.type = 'MultiLineString';
                break;
            default:
                throw 'Unknown WKT type';
        }
        return geometry;
    }
    fetch (obj) {
        const query = `RequestType=ID&ID=${obj.ObjCode}&TypeCode=${obj.TypeCode}&UseOSM=1`;        
        let req = new Request(`${this._serverBase}/SearchObject/SearchAddress.ashx?${query}${this._key}`);
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        let init = {
            method: 'GET',            
            mode: 'cors',
            cache: 'default',
        };
        return new Promise((resolve, reject) => {
            fetch (req, init)
            .then(response => {
                return response.text();
            })
            .then(text => {
                const json = JSON.parse (text.slice(1, text.length - 1));
                if(json.Status === 'ok'){
                    const rs = json.Result
                    .reduce((a,x) => a.concat(x.SearchResult), [])
                    .map(x => {
                        let g = this._convertGeometry (x.Geometry);
                        let props = Object.keys(x)
                        .filter(k => k !== 'Geometry')
                        .reduce((a,k) => {
                            a[k] = x[k];
                            return a;
                        }, {});
                        return {
                            type: 'Feature',
                            geometry: g,
                            properties: props,
                        };
                    });                    
                    resolve({request: obj, items: rs, provider: this});
                }
                else {
                    reject(json);
                }                
            });
        });
    }
    find(value){        
        const query = `RequestType=SearchObject&IsStrongSearch=0&WithoutGeometry=1&UseOSM=1&Limit=${this._limit}&SearchString=${encodeURIComponent(value)}`;        
        let req = new Request(`${this._serverBase}/SearchObject/SearchAddress.ashx?${query}${this._key}`);
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        let init = {
            method: 'GET',            
            mode: 'cors',
            cache: 'default',
        };
        return new Promise((resolve, reject) => {
            fetch (req, init)
            .then(response => {
                return response.text();
            })
            .then(text => {
                const json = JSON.parse (text.slice(1, text.length - 1));
                if(json.Status === 'ok'){
                    const rs = json.Result.reduce((a,x) => a.concat(x.SearchResult), []); 
                    resolve({request: value, items: rs, provider: this});
                }
                else {
                    reject(json);
                }                
            });
        });
    }
}

window.nsGmx = window.nsGmx || {};
window.nsGmx.OsmDataProvider = OsmDataProvider;

export { OsmDataProvider };