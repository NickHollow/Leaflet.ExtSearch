import { EventTarget } from './lib/EventTarget/src/EventTarget.js';

class ResultView extends EventTarget {
    constructor({input, replaceInput = false}){
        super();
        this._input = input;            
        this.index = -1;
        this.count = 0;
        this._item = null;
        this._inputText = '';
        this._replaceInput = replaceInput;
        this._list = L.DomUtil.create('div');
        this._list.setAttribute('class', 'leaflet-ext-search-list noselect');

        this.allowNavigation = true;

        this._list.style.top = `${this._input.offsetTop + this._input.offsetHeight + 2}px`;
        this._list.style.left = `${this._input.offsetLeft}px`;

        this._handleKey = this._handleKey.bind(this);
        this._input.addEventListener('keydown', this._handleKey);

        this._handleInputClick = this._handleInputClick.bind(this);
        this._input.addEventListener('click', this._handleInputClick);

        this._handleFocus = this._handleFocus.bind(this);
        this._input.addEventListener('focus', this._handleFocus);
        this._list.addEventListener('keydown', this._handleKey);

        this._handleWheel = this._handleWheel.bind(this);
        this._list.addEventListener('wheel', this._handleWheel);
        L.DomEvent.disableClickPropagation(this._list).disableScrollPropagation(this._list);
        // this._list.addEventListener('mousewheel', this._handleWheel.bind(this));
        // this._list.addEventListener('MozMousePixelScroll', this._handleWheel.bind(this));       
        this._input.parentElement.appendChild(this._list); 

        this._handleChange = this._handleChange.bind(this);
        this._input.addEventListener('input', this._handleChange);
    }

    _handleInputClick (e) {
        e.stopPropagation();
    }

    _handleFocus(e){        
        if(this.index >= 0) {
            let el = this._list.querySelector(`[tabindex="${this.index}"]`); 
            L.DomUtil.removeClass (el, 'leaflet-ext-search-list-selected');
        }
        this.index = -1;
        this._item = null;
    } 

    _handleChange(e){
        this._inputText = this._input.value;
    }

    _handleWheel (e) {
        e.stopPropagation();        
    } 

    _handleKey(e){        
        if(this.listVisible()) {
            switch (e.keyCode){
                // ArroLeft / ArrowRight
                case 37:
                case 39:
                    e.stopPropagation();
                    break;
                // ArrowDown
                case 40:
                    e.preventDefault();
                    e.stopPropagation();                 
                    if (this.allowNavigation) {                        
                        if (this.index < 0){
                            this.index = 0;
                        }
                        else if (0 <= this.index && this.index < this.count - 1){
                            let el = this._list.querySelector(`[tabindex="${this.index}"]`);
                            L.DomUtil.removeClass (el, 'leaflet-ext-search-list-selected');
                            ++this.index;
                        }   
                        else {
                            let el = this._list.querySelector(`[tabindex="${this.index}"]`);
                            L.DomUtil.removeClass (el, 'leaflet-ext-search-list-selected');
                            this.index = this.count - 1;
                        }
                        let el = this._list.querySelector(`[tabindex="${this.index}"]`);
                        L.DomUtil.addClass (el, 'leaflet-ext-search-list-selected'); 
                        this.selectItem(this.index);
                        el.focus();
                    }
                    break;
                // ArrowUp
                case 38:
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (this.allowNavigation) {
                        if(this.index > 0){
                            let el = this._list.querySelector(`[tabindex="${this.index}"]`); 
                            L.DomUtil.removeClass (el, 'leaflet-ext-search-list-selected');
                            --this.index;
                            el = this._list.querySelector(`[tabindex="${this.index}"]`);
                            L.DomUtil.addClass (el, 'leaflet-ext-search-list-selected');
                            this.selectItem(this.index);
                            el.focus();            
                        }
                        else if (this.index === 0) {                    
                            this._input.focus();                
                            this._input.value = this._inputText;                    
                        }
                    }
                    break;
                // Enter
                case 13:
                    if (this.index < 0 && this._input.value){
                        const text = this._input.value;
                        this._input.focus();
                        this._input.setSelectionRange(text.length, text.length);                                      
                        this.hide();
                        
                        let event = document.createEvent('Event');
                        event.initEvent('suggestions:confirm', false, false);
                        event.detail = text;
                        this.dispatchEvent(event);
                    }
                    else {
                        this.complete (this.index);
                    }                   
                    break;
                // Escape
                case 27:
                    if (this.index < 0) {
                        this.hide ();
                    }
                    this._input.focus();
                    this._input.value = this._inputText;
                    break;                 
                default:
                    break;
            }            
        }
        else {            
            if (e.keyCode === 13 && this._input.value){ 
                const text = this._input.value;
                this._input.setSelectionRange(text.length, text.length);

                let event = document.createEvent('Event');
                event.initEvent('suggestions:confirm', false, false);
                event.detail = text;
                this.dispatchEvent(event);                
            }
            else if (e.keyCode === 27){
                this._input.value = '';
                this.index = -1;
                this._input.focus();                
            }
        } 
                                                                    
    }

    listVisible(){
        return this.count > 0 && this._list.style.display !== 'none';
    }

    selectItem(i){        
        this._item = this._items[i];        
        const text = this._item.name;
        if (this._replaceInput) {
            this._input.value = text;            
            this._input.setSelectionRange(text.length, text.length);
        }        
    }

    _handleClick (i, e){
        e.preventDefault();
        this.complete (i);
    }

    complete(i){
        let item = i >= 0 ? this._items[i] : this._item ? this._item : null;
        if(item) {
            this._item = item;        
            this.index = -1;            
            const text = item.name;
            if (this._replaceInput) {
                this._input.value = text;
                this._input.setSelectionRange(text.length, text.length);
            }
            this._input.focus();
            this.hide();

            let event = document.createEvent('Event');
            event.initEvent('suggestions:select', false, false);
            event.detail = item;
            this.dispatchEvent(event);            
        }        
    }

    show(items, highlight) {        
        if (items.length) {
            this._item = null;
            this.index = -1;
            this._items = items;
            const html = '<ul>' + this._items
            .filter((x) => x.name && x.name.length)
            .map((x,i) => {
                let name = `<span class="leaflet-ext-search-list-item-normal">${x.name}</span>`;
                if (highlight && highlight.length){
                    const start = x.name.toLowerCase().indexOf (highlight.toLowerCase());
                    if (start != -1) {
                        let head =  x.name.substr(0, start);
                        if(head.length){
                            head = `<span class="leaflet-ext-search-list-item-normal">${head}</span>`;
                        }                        
                        let tail = x.name.substr(start + highlight.length);
                        if(tail.length){
                            tail = `<span class="leaflet-ext-search-list-item-normal">${tail}</span>`;
                        }
                        name = `${head}<span class="leaflet-ext-search-list-item-highlight">${highlight}</span>${tail}`;
                    }                                        
                }                
                return `<li tabindex=${i}>${name}</li>`;               
            }, []).join('') + '</ul>';

            this._list.innerHTML = html;
            let elements = this._list.querySelectorAll('li');
            for (let i = 0; i < elements.length; ++i){
                elements[i].addEventListener('click', this._handleClick.bind(this, i));            
            }
            
            this.count = elements.length;
            this._list.style.display = 'block';
        }
    }
    hide() {        
        this._list.style.display = 'none';                
    }
}

export { ResultView };