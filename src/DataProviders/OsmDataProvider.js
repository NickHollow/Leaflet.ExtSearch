
import { EventTarget } from '../lib/EventTarget/src/EventTarget.js';

class OsmDataProvider extends EventTarget {
    constructor({serverBase}){
        super();
        this._serverBase = serverBase;             
        this.showSuggestion = true;    
        this.showOnSelect = true;
        this.showOnEnter = true;
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
        const query = `WrapStyle=None&RequestType=ID&ID=${obj.ObjCode}&TypeCode=${obj.TypeCode}&UseOSM=1`;        
        let req = new Request(`${this._serverBase}/SearchObject/SearchAddress.ashx?${query}${this._key}`);
        let headers = new Headers();
        headers.append('Content-Type','application/json');        
        let init = {
            method: 'GET',            
            mode: 'cors',
            credentials: 'include',        
            cache: 'default',
        };
        return new Promise((resolve, reject) => {
            fetch (req, init)
            .then(response => response.json())
            .then(json => {
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
                            feature: {
                                type: 'Feature',
                                geometry: g,
                                properties: props,                            
                            },
                            provider: this,
                            query: obj,
                        };
                    });
                    let event = document.createEvent('Event');
                    event.initEvent('fetch', false, false);
                    event.detail = rs;
                    this.dispatchEvent(event);
                    resolve(rs);
                }
                else {
                    reject(json);
                }                
            })
            .catch(response => reject(response));
        });
    }
    find(value, limit, strong, retrieveGeometry){                
        return new Promise((resolve, reject) => {
            if (value || value.trim()) {
                const _strong = Boolean(strong) ? 1 : 0;
                const _withoutGeometry = Boolean(retrieveGeometry) ? 0 : 1; 
                const query = `WrapStyle=None&RequestType=SearchObject&IsStrongSearch=${_strong}&WithoutGeometry=${_withoutGeometry}&UseOSM=1&Limit=${limit}&SearchString=${encodeURIComponent(value)}`;        
                let req = new Request(`${this._serverBase}/SearchObject/SearchAddress.ashx?${query}${this._key}`);
                let headers = new Headers();
                headers.append('Content-Type','application/json');        
                let init = {
                    method: 'GET',
                    mode: 'cors', 
                    credentials: 'include',
                    cache: 'default',
                };
                fetch (req, init)
                .then(response => response.json())
                .then(json => {                
                    if(json.Status === 'ok'){                    
                        const rs = json.Result
                        .reduce((a,x) => a.concat(x.SearchResult), [])
                        .map(x => {
                            if (retrieveGeometry && x.Geometry) {
                                let g = this._convertGeometry (x.Geometry);
                                let props = Object.keys(x)
                                .filter(k => k !== 'Geometry')
                                .reduce((a,k) => {
                                    a[k] = x[k];
                                    return a;
                                }, {});
                                return {
                                    name: x.ObjNameShort,
                                    feature: {
                                        type: 'Feature',
                                        geometry: g,
                                        properties: props,                            
                                    },
                                    properties: props,
                                    provider: this,
                                    query: value,
                                };
                            }
                            else {
                                return {
                                    name: x.ObjNameShort,
                                    properties: x,
                                    provider: this,
                                    query: value,
                                };
                            }                        
                        });
                        if (strong && retrieveGeometry) {                        
                            let event = document.createEvent('Event');
                            event.initEvent('fetch', false, false);
                            event.detail = rs;
                            this.dispatchEvent(event);
                        }
                        resolve(rs);
                    }
                    else {
                        reject(json);
                    }                
                })
                .catch(response => reject(response));

            }
            else {
                reject('Empty string');
            }                        
        });
    }
}

export { OsmDataProvider };