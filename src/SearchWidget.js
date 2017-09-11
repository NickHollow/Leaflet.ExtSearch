import './SearchWidget.css';
import { ResultView } from './ResultView.js';

function chain (tasks, state) {
    return tasks.reduce(
        (prev, next) => prev.then(next),
        new Promise ((resolve, reject) => resolve (state))
    );
}

class SearchWidget {
    constructor(container, {placeHolder, providers, suggestionTimeout = 1000, limit = 10, fuzzySearchLimit = 1000, retrieveManyOnEnter = false}){
        this._container = container;
        this._allowSuggestion = true;
        this._providers = providers;
        this._suggestionTimeout = suggestionTimeout;
        this._limit = limit;
        this._fuzzySearchLimit = fuzzySearchLimit;
        this._retrieveManyOnEnter = retrieveManyOnEnter;

        this._container.classList.add('leaflet-ext-search');
        this._container.innerHTML = `<input type="text" value="" placeholder="${placeHolder}" /><span class="leaflet-ext-search-button"></span>`;
        this._input = this._container.querySelector('input');
        this._input.addEventListener('input', this._handleChange.bind(this));
        this._input.addEventListener('mousemove', this._handleMouseMove.bind(this));
        this._input.addEventListener('dragstart', this._handleMouseMove.bind(this));
        this._input.addEventListener('drag', this._handleMouseMove.bind(this));

        this._button = this._container.querySelector('.leaflet-ext-search-button');
        this._button.addEventListener('click', this._handleSearch.bind(this));

        this.results = new ResultView({
            input: this._input,
            onSelect: this._selectItem.bind(this),
            onEnter: this._search.bind(this),
        });

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
                            .find (text, this._limit, false, false)
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
    }
    _search (text) {
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
                            });
                        }
                    });
                };
            });

            chain (tasks, {completed: false, response: []})
            .then(state => {
                if(state.response.length > 0 && !this._retrieveManyOnEnter){
                    let item = state.response[0];
                    item.provider
                    .fetch(item.properties)
                    .then(response => {});
                }
            });

            this.results && this.results.hide();
    }
    _selectItem (item){
        return item.provider.fetch(item.properties);
    }
    _handleSearch (e) {
         e.stopPropagation();
         this._search (this._input.value);
    }
    setText (text) {
        this._input.value = text;
    }
}

export { SearchWidget };
