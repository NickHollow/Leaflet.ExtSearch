import './SearchControl.css';
import { ResultView } from './ResultView.js';
import { GmxRenderer } from './GmxRenderer.js';
import { OsmDataProvider } from './OsmDataProvider.js';

let SearchControl = L.Control.extend({
    includes: [L.Mixin.Events],
    initialize: function(options) {    
        L.setOptions(this, options);        
    },   
    _handleChange: function(e){
        if(this._input.value.length > 2){
            Promise
            .all(this.options.providers.map(p => p.find(this._input.value)))
            .then(values => {
                const entries = values.filter(x => x.provider.showSuggestion);
                this.results.show(entries);
            });
        }        
    },
    _handleMouseMove: function(e){
        e.stopPropagation();
    },
    _selectItem: function(e){
        const renderOptions = {
            editable: false,
            map: true,
            pointStyle: {
                size: 8,
                weight: 1,
                opacity: 1,
                color: '#00008B'
            },
            lineStyle: {
                fill: false,
                weight: 2,
                opacity: 1,
                color: '#00008B'
            }
        };
        e.detail.provider.fetch (e.detail.properties).then(response => {
            if(response.items.length > 0){
                this._renderer.render(response.items[0], renderOptions);
            }
        });        
    },
    onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'leaflet-ext-search');
        this._container.innerHTML = '<input type="text" value="" />';
        this._input = this._container.querySelector('input');

        L.DomEvent.on(this._input, 'input', this._handleChange.bind(this));
        L.DomEvent.on(this._input, 'mousemove', this._handleMouseMove.bind(this));        

        this.results = new ResultView({input: this._input});
        document.addEventListener('item:select', this._selectItem.bind(this));

        this._renderer = this.options.renderer || new GmxRenderer(map);

        return this._container;
    }
});

window.nsGmx = window.nsGmx || {};
window.nsGmx.SearchControl = SearchControl; 

export { SearchControl };
