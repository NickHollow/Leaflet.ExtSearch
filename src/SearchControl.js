import './SearchControl.css';
import { ResultView } from './ResultView.js';

let SearchControl = L.Control.extend({
    includes: [L.Mixin.Events],
    initialize: function(options) {    
        L.setOptions(this, options);
    },
    _hidePopup: function(){
        // this.results.hide();
    },
    _handleChange: function(e){
        Promise
        .all(this.options.providers.map(p => p.suggest(this._input.value)))
        .then(values => {
            const entries = values.filter(x => x.target.showSuggestion);
            this.results.show(entries);
        });
    },
    _selectItem: function(e){
                
    },
    onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'leaflet-ext-search');
        this._container.innerHTML = '<input type="text" value="" />';
        this._input = this._container.querySelector('input');

        L.DomEvent.on(this._input, 'input', this._handleChange.bind(this));
        L.DomEvent.on(this._input, 'blur', this._hidePopup.bind(this));  

        this.results = new ResultView({input: this._input});
        document.addEventListener('item:select', this._selectItem.bind(this));

        return this._container;
    }
});


export { SearchControl };
