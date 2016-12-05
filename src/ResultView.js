class ResultView {
    constructor({input, onSelect, onEnter}){
        this._input = input;
        this._onSelect = onSelect;
        this._onEnter = onEnter;
        this.index = -1;
        this.count = 0;
        this._item = null;
        this._inputText = '';
        this._list = L.DomUtil.create('div');
        this._list.setAttribute('class', 'leaflet-ext-search-list noselect');        

        this._list.style.top = `${this._input.offsetTop + this._input.offsetHeight + 2}px`;
        this._list.style.left = `${this._input.offsetLeft}px`;
        this._input.addEventListener('keydown', this._handleKey.bind(this));
        this._input.addEventListener('focus', this._handleFocus.bind(this));
        this._list.addEventListener('keydown', this._handleKey.bind(this));
        this._list.addEventListener('wheel', this._handleWheel.bind(this));
        // this._list.addEventListener('mousemove', this._handleWheel.bind(this));
        this._input.parentElement.appendChild(this._list); 
        this._input.addEventListener('input', this._handleChange.bind(this));      
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

    _handleMouseMove(e){
        e.stopPropagation();
    }    

    _handleKey(e){
        if(this.listVisible()) {
            if(e.key === 'ArrowDown'){            
                e.preventDefault();                 
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
            else if (e.key === 'ArrowUp'){
                e.preventDefault();            
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
            else if (e.key === 'Enter'){
                if (this.index < 0 && this._input.value && typeof this._onEnter == 'function'){
                    const text = this._input.value;
                    this._input.focus();
                    this._input.setSelectionRange(text.length, text.length);                                      
                    this.hide();                        
                    this._onEnter (text);
                }
                else {
                    this.complete (this.index);
                }                
            }
            else if (e.key === 'Escape'){
                if (this.index < 0) {
                    this.hide ();
                }
                this._input.focus();
                this._input.value = this._inputText;                            
            } 
        }
        else {
            if (e.key === 'Enter' && this._input.value && typeof this._onEnter == 'function'){ 
                const text = this._input.value;
                this._input.setSelectionRange(text.length, text.length);
                this._onEnter (text);
            }
            else if (e.key === 'Escape'){
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
        this._input.value = text;
        this._input.setSelectionRange(text.length, text.length);        
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
            this._input.value = text;
            this._input.setSelectionRange(text.length, text.length);                          
            this._input.focus();
            this.hide();
            if(typeof this._onSelect === 'function'){
                this._onSelect (item);
            }
        }        
    }

    show(items) {
        if (items.length) {
            this._item = null;
            this.index = -1;
            this._items = items;
            const html = '<ul>' + this._items.map((x,i) => `<li tabindex=${i}>${x.name}</li>`, []).join('') + '</ul>';                            

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