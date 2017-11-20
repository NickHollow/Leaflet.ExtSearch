import { SearchWidget } from './SearchWidget.js';

let SearchControl = L.Control.extend({
    includes: L.Evented ? L.Evented.prototype : L.Mixin.Events,
    initialize: function(options) {
        L.setOptions(this, options);
        this._allowSuggestion = true;
        this.options.suggestionTimeout = this.options.suggestionTimeout || 1000;
        this.options.suggestionLimit = this.options.suggestionLimit || 10;
    },
    onAdd: function(map) {
        this._container = L.DomUtil.create('div', 'leaflet-ext-search');
        this._widget = new SearchWidget(this._container, this.options);
        map.on('click', this._widget.results.hide.bind(this._widget.results));
        map.on('dragstart', this._widget.results.hide.bind(this._widget.results));        
        return this._container;
    },
    addTo: function(map) {
        L.Control.prototype.addTo.call(this, map);
        if (this.options.addBefore) {
            this.addBefore(this.options.addBefore);
        }
        return this;
    },

    addBefore: function(id) {
        let parentNode = this._parent && this._parent._container;
        if (!parentNode) {
            parentNode = this._map && this._map._controlCorners[this.getPosition()];
        }
        if (!parentNode) {
            this.options.addBefore = id;
        }
        else {
            for (let i = 0, len = parentNode.childNodes.length; i < len; i++) {
                let it = parentNode.childNodes[i];
                if (id === it._id) {
                    parentNode.insertBefore(this._container, it);
                    break;
                }
            }
        }
        return this;
    },

    setText (text) {
        this._widget.setText (text);
    },

    setPlaceHolder (value) {
        this._widget.setPlaceHolder (value);
    },
});

export { SearchControl };
