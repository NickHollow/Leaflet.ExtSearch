class DataProvider {
    constructor({values, showSuggestion}){        
        this._values = values;
        this.showSuggestion = showSuggestion;
    }    
    find(value){
        return new Promise((resolve, reject) => {
            const result = this._values.filter (x => x.startsWith (value));            
            resolve({request: value, response: result, target: this });                     
        });
    }
}

export { DataProvider };