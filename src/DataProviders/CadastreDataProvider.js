import { EventTarget } from '../lib/EventTarget/src/EventTarget.js';

class CadastreDataProvider extends EventTarget {
    constructor({serverBase, tolerance}){
        super();
        this._serverBase = serverBase;        
        this._tolerance = tolerance;        
        this.showSuggestion = true;
        this.showOnSelect = false;
        this.showOnEnter = true;
        this._cadastreLayers = [
			{id: 1, title: 'Участок', 	reg: /^\d\d:\d+:\d+:\d+$/},
			{id: 2, title: 'Квартал',	reg: /^\d\d:\d+:\d+$/},
			{id: 3, title: 'Район', 	reg: /^\d\d:\d+$/},
			{id: 4, title: 'Округ', 	reg: /^\d\d$/},
            {id: 5, title: 'ОКС', 		reg: /^\d\d:\d+:\d+:\d+:\d+$/},
			{id: 10, title: 'ЗОУИТ', 	reg: /^\d+\.\d+\.\d+/}
			// ,
			// {id: 7, title: 'Границы', 	reg: /^\w+$/},
			// {id: 6, title: 'Тер.зоны', 	reg: /^\w+$/},
			// {id: 12, title: 'Лес', 		reg: /^\w+$/},
			// {id: 13, title: 'Красные линии', 		reg: /^\w+$/},
			// {id: 15, title: 'СРЗУ', 	reg: /^\w+$/},
			// {id: 16, title: 'ОЭЗ', 		reg: /^\w+$/},
			// {id: 9, title: 'ГОК', 		reg: /^\w+$/},
			// {id: 10, title: 'ЗОУИТ', 	reg: /^\w+$/}
			// /[^\d\:]/g,
			// /\d\d:\d+$/,
			// /\d\d:\d+:\d+$/,
			// /\d\d:\d+:\d+:\d+$/
		];
    }    
    getCadastreLayer (str, type) {
        str = str.trim();
        for (var i = 0, len = this._cadastreLayers.length; i < len; i++) {
            var it = this._cadastreLayers[i];
            if (it.id === type) { return it; }
            if (it.reg.exec(str)) { return it; }
        }
        return this._cadastreLayers[0];
    }
    find(value, limit, strong, retrieveGeometry){   
        const cadastreLayer = this.getCadastreLayer(value);    
        return new Promise(resolve => {
            // let req = new Request(`${this._serverBase}/typeahead?limit=${limit}&skip=0&text=${value}&type=${cadastreLayer.id}`);
            let req = new Request(`${this._serverBase}/features/${cadastreLayer.id}?text=${value}&tolerance=${this._tolerance}&limit=${limit}`);
            let headers = new Headers();
            headers.append('Content-Type','application/json');            
            let init = {
                method: 'GET',            
                mode: 'cors',                
                cache: 'default',
            };
            fetch (req, init)
            .then(response => response.json())
            .then(json => {
                // if(json.status === 200){
                    let rs = json.features.map(x => {
                        return {
                            name: x.attrs.name || x.attrs.cn || x.attrs.id,
                            properties: x,
                            provider: this,
                            query: value,
                        };
                    });
                    resolve(rs);
                // }
                // else {
                    // resolve(json);
                // }                                       
                                    
            });
        });
    }
    fetch(obj) {
		var text = obj.attrs.name || obj.attrs.cn || obj.attrs.id;
        const cadastreLayer = this.getCadastreLayer(text, obj.type);
        return new Promise(resolve => {
            if(cadastreLayer) {
                // let req = new Request(`${this._serverBase}/features/${cadastreLayer.id}?tolerance=${this._tolerance}&limit=1&text=${obj.value}`);
                let req = new Request(`${this._serverBase}/features/${cadastreLayer.id}?tolerance=${this._tolerance}&limit=1&text=${text}`);
                let headers = new Headers();
                headers.append('Content-Type','application/json');
                let init = {
                    method: 'GET',            
                    mode: 'cors',                    
                    cache: 'default',
                };
                fetch (req, init)
                .then(response => response.json())
                .then(json => {
                    if(json.status === 200) {
                        let event = document.createEvent('Event');
                        event.initEvent('fetch', false, false);
                        event.detail = json;
                        this.dispatchEvent(event);
                        
                        let rs = json.features.map(x => {
                            return {
                                name: x.attrs.name || x.attrs.cn || x.attrs.id,
                                properties: x,
                                provider: this,
                                query: obj,
                            };
                            
                        });
                        resolve(rs);

                    }
                    else {
                        resolve(json);
                    }                                        
                });
            }
            else {
                resolve([]);
            }            
        });
    }
}

export { CadastreDataProvider };