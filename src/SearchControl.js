import './SearchControl.css';
import { ResultView } from './ResultView.js';
import { GmxRenderer } from './GmxRenderer.js';
import { OsmDataProvider } from './OsmDataProvider.js';
import { CoordinatesDataProvider } from './CoordinatesDataProvider.js';
import { CadastreDataProvider } from './CadastreDataProvider.js';

let SearchControl = L.Control.extend({
    includes: [L.Mixin.Events],
    initialize: function(options) {    
        L.setOptions(this, options);
    },
    _chain (tasks, state) {        
        return tasks.reduce(
            (prev, next) => prev.then(next),
            new Promise ((resolve, reject) => resolve (state))
        );
    },
    _handleChange: function(e){
        const text = this._input.value;
        if(text.length){

            let tasks = this.options.providers.map(provider => {
                return state => {
                    return new Promise(resolve => {
                        if (this.options.showFirst && state.completed) {
                            resolve(state);
                        }
                        else {
                            let p = provider.showSuggestion ? provider.find (text) : provider.fetch (text);
                            p.then(response => {
                                state.completed = this.options.showFirst && response.length;
                                state.response = state.response.concat(response);                                
                                resolve(state);
                            });
                        }
                    });
                };
            });

            this._chain (tasks, {completed: false, response: []})
            .then(state => {
                const features = state.response.filter(x => x.provider.showOnMap).map(x => x.feature);
                this._renderer.render(features, this.options.style);                

                if(features.length == 0){
                    const entries = state.response.filter(x => x.provider.showSuggestion);
                    this.results.show(entries);
                }
            });            
        }        
    },
    _handleMouseMove: function(e){
        e.stopPropagation();
    },
    _selectItem: function(item){        
        item.provider
        .fetch(item.properties)
        .then(response => {
            if (item.provider.showOnSelect && response.length) {
                let features = response.map (x => x.feature);
                this._renderer.render(features, this.options.style);                
            }            
        });
    },
    onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'leaflet-ext-search');
        this._container.innerHTML = '<input type="text" value="" />';
        this._input = this._container.querySelector('input');

        // const style = getComputedStyle (map._container);
        // const matches = (/\d+/g).exec (style.width);
        // if(matches && matches.length){
        //     const width = Number.parseInt (matches[0]) - 50;
        //     this._input.style.width = `${width}px`;
        // }
              
        this._input.addEventListener('input', this._handleChange.bind(this));
        this._input.addEventListener('mousemove', this._handleMouseMove.bind(this));

        this.results = new ResultView({
            input: this._input,
            onSelect: this._selectItem.bind(this),
        });        

        this._renderer = this.options.renderer || new GmxRenderer(map);

        return this._container;
    }
});

window.nsGmx = window.nsGmx || {};
window.nsGmx.SearchControl = SearchControl; 

export { SearchControl };
