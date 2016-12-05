import './SearchControl.css';
import { ResultView } from './ResultView.js';
import { GmxRenderer } from './GmxRenderer.js';
import { OsmDataProvider } from './DataProviders/OsmDataProvider.js';
import { CoordinatesDataProvider } from './DataProviders/CoordinatesDataProvider.js';
import { CadastreDataProvider } from './DataProviders/CadastreDataProvider.js';

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

            let tasks = this.options.providers
                .filter (provider => provider.showSuggestion)
                .map(provider => {
                    return state => {
                        return new Promise(resolve => {
                            if (this.options.showFirst && state.completed) {
                                resolve(state);
                            }
                            else {
                                provider
                                .find (text, this.options.limit, false, false)
                                .then(response => {
                                    state.completed = this.options.showFirst && response.length > 0;
                                    state.response = state.response.concat(response);                                
                                    resolve(state);
                                });                          
                            }
                        });
                    };
                });

            this._chain (tasks, { completed: false, response: [] }).then(state => {                
                this.results.show(state.response);
            });
        }        
    },
    _handleMouseMove: function(e){
        e.stopPropagation();
    },
    _search: function (text) {
        let tasks = this.options.providers
            .filter (provider => provider.showOnEnter)
            .map(provider => {
                return state => {
                    return new Promise(resolve => {
                        if (this.options.showFirst && state.completed) {
                            resolve(state);
                        }
                        else {
                            let p = provider.find (text, 1, true, true);
                            p.then(response => {
                                state.completed = response.length > 0;
                                state.response = state.response.concat(response);                                
                                resolve(state);
                            });
                        }
                    });
                };
            });

            this._chain (tasks, {completed: false, response: []})
            .then(state => {
                const features = state.response
                .filter(x => x.provider.showOnMap)
                .map(x => x.feature);
                if(features.length) {
                    this._renderer.render([features[0]], this.options.style);
                }                
            });
    },
    _selectItem: function(item){        
        item.provider
        .fetch(item.properties)
        .then(response => {
            if (item.provider.showOnSelect && response.length) {
                let features = response
                .filter(x => x.provider.showOnMap)
                .map (x => x.feature);
                this._renderer.render(features, this.options.style);                
            }            
        });
    },
    _handleCollapse: function(e){
        e.preventDefault();
        let btn = e.target;
        let expanded = L.DomUtil.hasClass (btn, 'leaflet-ext-search-button-expanded');
        if (expanded) {
            L.DomUtil.removeClass (btn, 'leaflet-ext-search-button-expanded');
            L.DomUtil.addClass (btn, 'leaflet-ext-search-button-collapsed');
            this._input.style.display = 'none';
        }
        else {
            L.DomUtil.removeClass (btn, 'leaflet-ext-search-button-collapsed');
            L.DomUtil.addClass (btn, 'leaflet-ext-search-button-expanded');
            this._input.style.display = 'inline';
        }
    },
    onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'leaflet-ext-search');
        this._container.innerHTML = `<input type="text" value="" placeholder="${this.options.placeHolder}" /><span class="leaflet-ext-search-button leaflet-ext-search-button-expanded"></span>`;
        this._input = this._container.querySelector('input');

        // const style = getComputedStyle (map._container);
        // const matches = (/\d+/g).exec (style.width);
        // if(matches && matches.length){
        //     const width = Number.parseInt (matches[0]) - 50;
        //     this._input.style.width = `${width}px`;
        // }

        let button = this._container.querySelector('.leaflet-ext-search-button');
        button.addEventListener ('click', this._handleCollapse.bind(this));
              
        this._input.addEventListener('input', this._handleChange.bind(this));
        this._input.addEventListener('mousemove', this._handleMouseMove.bind(this));

        this.results = new ResultView({
            input: this._input,
            onSelect: this._selectItem.bind(this),
            onEnter: this._search.bind(this),
        });        

        this._renderer = this.options.renderer || new GmxRenderer(map);

        return this._container;
    }
});

window.nsGmx = window.nsGmx || {};
window.nsGmx.SearchControl = SearchControl; 

export { SearchControl };
