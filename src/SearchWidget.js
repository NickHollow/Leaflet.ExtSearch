import './SearchWidget.css';
import { ResultView } from './ResultView.js';
import { EventTarget } from './lib/EventTarget/src/EventTarget.js';

function chain (tasks, state) {
    return tasks.reduce(
        (prev, next) => prev.then(next),
        new Promise ((resolve, reject) => resolve (state))
    );
}

class SearchWidget extends EventTarget {
    constructor(container, {placeHolder, providers, suggestionTimeout = 1000, suggestionLimit = 10, fuzzySearchLimit = 1000, retrieveManyOnEnter = false, replaceInputOnEnter = false}){
        super ();
        this._container = container;
        this._allowSuggestion = true;
        this._providers = providers;
        this._suggestionTimeout = suggestionTimeout;
        this._suggestionLimit = suggestionLimit;
        this._fuzzySearchLimit = fuzzySearchLimit;
        this._retrieveManyOnEnter = retrieveManyOnEnter;
        this._replaceInputOnEnter = replaceInputOnEnter;

        this._container.classList.add('leaflet-ext-search');
        this._container.innerHTML = `<input type="text" value="" placeholder="${placeHolder}" /><span class="leaflet-ext-search-button"></span>`;
        this._input = this._container.querySelector('input');

        this._handleChange = this._handleChange.bind(this);
        this._input.addEventListener('input', this._handleChange);

        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._input.addEventListener('mousemove', this._handleMouseMove);        
        this._input.addEventListener('dragstart', this._handleMouseMove);
        this._input.addEventListener('drag', this._handleMouseMove);

        this._handleSearch = this._handleSearch.bind(this);

        this._button = this._container.querySelector('.leaflet-ext-search-button');
        this._button.addEventListener('click', this._handleSearch);

        this.results = new ResultView({ input: this._input, replaceInput: this._replaceInputOnEnter});

        this._search = this._search.bind(this);
        this._selectItem = this._selectItem.bind(this);

        this.results.addEventListener('suggestions:confirm', e => {
            let event = document.createEvent('Event');
            event.initEvent('suggestions:confirm', false, false);
            event.detail = e.detail;
            this.dispatchEvent(event);
            this._search(e);                        
        });
        this.results.addEventListener('suggestions:select', this._selectItem);

        // map.on ('click', this.results.hide.bind(this.results));
        // map.on ('dragstart', this.results.hide.bind(this.results));
    }
    _suggest (text){
        this.results.allowNavigation = false;
        let tasks =
            this._providers
            .filter (provider => provider.showSuggestion)
            .map(provider => {
                return state => {
                    return new Promise(resolve => {
                        if (state.completed) {
                            resolve(state);
                        }
                        else {
                            provider
                            .find (text, this._suggestionLimit, false, false)
                            .then(response => {
                                state.completed = response.length > 0;
                                state.response = state.response.concat(response);
                                resolve(state);
                            })
                            .catch(e => console.log(e));
                        }
                    });
                };
            });
        chain (tasks, { completed: false, response: [] })
        .then(state => {
            this.results.show(state.response, text.trim());
            this.results.allowNavigation = true;
        });
    }
    _handleChange(e) {
        if (this._input.value.length) {
            if (this._allowSuggestion) {
                this._allowSuggestion = false;
                this._timer = setTimeout(() => {
                    clearTimeout (this._timer);
                    this._allowSuggestion = true;
                    const text = this._input.value;
                    this._suggest(text);
                }, this._suggestionTimeout);
            }
        }
        else {
            this.results.hide();
        }
    }
    _handleMouseMove(e){
        e.stopPropagation();
        e.preventDefault();
    }
    _search (e) {
        let text = e.detail;
        let tasks = this._providers
            .filter (provider => provider.showOnEnter)
            .map(provider => {
                return state => {
                    return new Promise(resolve => {
                        if (state.completed) {
                            resolve(state);
                        }
                        else {
                            provider
                            .find (text, this._retrieveManyOnEnter ? this._fuzzySearchLimit : 1, true, true)
                            .then(response => {
                                state.completed = response.length > 0;
                                state.response = state.response.concat(response);
                                resolve(state);
                            })
                            .catch(e => {
                                console.log(e);
                                resolve(state);
                            });
                        }
                    });
                };
            });

            chain (tasks, {completed: false, response: []})
            .then(state => {                
                // if(state.response.length > 0 && !this._retrieveManyOnEnter){
                //     let item = state.response[0];
                //     item.provider
                //     .fetch(item.properties)
                //     .then(response => {});                    
                // }
            });

            this.results && this.results.hide();
    }
    _selectItem (e){
        let item = e.detail;
        return item.provider.fetch(item.properties);
    }
    _handleSearch (e) {
         e.stopPropagation();
         this._search ({detail: this._input.value});
    }
    setText (text) {
        this._input.value = text;
    }
    setPlaceHolder (value) {
        this._input.placeholder = value;
    }
}

export { SearchWidget };
