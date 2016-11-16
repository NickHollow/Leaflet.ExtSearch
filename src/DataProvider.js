class DataProvider {
    constructor({values, showSuggestion}){        
        this._values = values;
        this.showSuggestion = showSuggestion;
    }    
    suggest(value, caseSensitive){
        return new Promise((resolve, reject) => {
            const result = this._values.filter (x => (caseSensitive ? x : x.toLowerCase()).startsWith (caseSensitive ? value : value.toLowerCase()));            
            resolve({request: value, response: result, target: this });                     
        });
    }
}

export { DataProvider };