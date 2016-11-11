import './SearchControl.css';
import { ResultView } from './ResultView.js';

class SearchControl {
    constructor(container, {providers}){
        this.providers = providers;
        this.handleChange = this.handleChange.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.hidePopup = this.hidePopup.bind(this);
        this.el = document.createElement('div');
        container.appendChild(this.el);
        this.el.innerHTML = '<input type="text" class="leaflet-ext-search" value="" />';
        this.el = container.querySelector('.leaflet-ext-search');
        this.el.addEventListener('input', this.handleChange, true);
        this.el.addEventListener('blur', this.hidePopup, true);        
        this.results = new ResultView({input: this.el});
        document.addEventListener('item:click', this.selectItem);
    }
    hidePopup(){
        this.results.hide();
    }    
    selectItem(e){
        this.el.value = e.detail;
    }
    handleChange(e) {
        Promise
        .all(this.providers.map(p => p.find(this.el.value)))
        .then(values => {
            const entries = values.filter(x => x.target.showSuggestion);
            this.results.show(entries);
        });
    }
}

export { SearchControl };