class CadastreDataProvider {
    constructor({serverBase, onFind}){
        this._serverBase = serverBase;
        this._onFind = onFind;
        this.showSuggestion = false;
        this.showOnMap = false;
        this._cadastreLayers = [
			{id: 5, title: 'ОКС', 		reg: /^\d\d:\d+:\d+:\d+:\d+$/},
			{id: 1, title: 'Участок', 	reg: /^\d\d:\d+:\d+:\d+$/},
			{id: 2, title: 'Квартал',	reg: /^\d\d:\d+:\d+$/},
			{id: 3, title: 'Район', 	reg: /^\d\d:\d+$/},
			{id: 4, title: 'Округ', 	reg: /^\d\d$/},
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
        return null;
    }
    find(text) {
        const cadastreLayer = this.getCadastreLayer(text);
        return new Promise(resolve => {
            if(cadastreLayer) {
                let req = new Request(`${this._serverBase}/${cadastreLayer.id}/${text}`);
                let headers = new Headers();
                headers.append('Content-Type','application/json');
                let init = {
                    method: 'GET',            
                    mode: 'cors',
                    cache: 'default',
                };
                fetch (req, init)
                .then(response => response.text())
                .then(text => {
                    const json = JSON.parse (text);                                            
                    resolve([]);
                    
                });
            }
            else {
                resolve([]);
            }            
        });
    }
    fetch(text) {
        const cadastreLayer = this.getCadastreLayer(text);
        return new Promise(resolve => {
            if(cadastreLayer) {
                let req = new Request(`${this._serverBase}/${cadastreLayer.id}/${text}`);
                let headers = new Headers();
                headers.append('Content-Type','application/json');
                let init = {
                    method: 'GET',            
                    mode: 'cors',
                    cache: 'default',
                };
                fetch (req, init)
                .then(response => response.text())
                .then(text => {
                    const json = JSON.parse (text);
                    if(json.status === 200){
                        if (typeof this._onFind === 'function'){
                            this._onFind(json);
                        }

                        let rs = {
                            name: json.feature.attrs.id,
                            properties: json,
                            provider: this,
                            query: text,
                        };
                        resolve([rs]);

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

window.nsGmx = window.nsGmx || {};
window.nsGmx.CadastreDataProvider = CadastreDataProvider;

export { CadastreDataProvider };