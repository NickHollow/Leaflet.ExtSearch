class ResultView {
    constructor({input, onSelect}){
        this._input = input;
        this._onSelect = onSelect;
        this.index = -1;
        this.count = 0;
        this._item = null;

        this._list = L.DomUtil.create('div');
        this._list.setAttribute('class', 'leaflet-ext-search-list noselect');        

        this._list.style.top = `${this._input.offsetTop + this._input.offsetHeight + 2}px`;
        this._list.style.left = `${this._input.offsetLeft}px`;
        this._input.addEventListener('keydown', this._handleKey.bind(this));
        this._list.addEventListener('keydown', this._handleKey.bind(this));
        this._list.addEventListener('wheel', this._handleWheel.bind(this));
        this._list.addEventListener('mousemove', this._handleWheel.bind(this));
        this._input.parentElement.appendChild(this._list);        
    }

    _handleWheel (e) {
        e.stopPropagation();
    }

    _handleMouseMove(e){
        e.stopPropagation();
    }

    _handleKey(e){                         
        if(e.key === 'ArrowDown'){
            e.preventDefault();            
            if (this.index < 0){
                this.index = 0;
            }
            else if (0 <= this.index && this.index < this.count - 1){
                L.DomUtil.removeClass (this._list.querySelector(`[tabindex="${this.index}"]`), 'leaflet-ext-search-list-selected');
                ++this.index;

            }   
            else {
                L.DomUtil.removeClass (this._list.querySelector(`[tabindex="${this.index}"]`), 'leaflet-ext-search-list-selected');
                this.index = this.count - 1;
            }
            L.DomUtil.addClass (this._list.querySelector(`[tabindex="${this.index}"]`), 'leaflet-ext-search-list-selected'); 
            this.selectItem(this.index);
        }
        else if (e.key === 'ArrowUp'){
            e.preventDefault();            
            if(this.index > 0){
                L.DomUtil.removeClass (this._list.querySelector(`[tabindex="${this.index}"]`), 'leaflet-ext-search-list-selected');
                --this.index;                
                L.DomUtil.addClass (this._list.querySelector(`[tabindex="${this.index}"]`), 'leaflet-ext-search-list-selected');
                this.selectItem(this.index);                                             
            }
            else {
                L.DomUtil.removeClass (this._list.querySelector(`[tabindex="${this.index}"]`), 'leaflet-ext-search-list-selected');
                this.index = -1;
                this._input.focus();
                this._item = null;
                this._input.value = '';                
            }            
        }
        else if (e.key === 'Enter'){
            this.complete (this.index);            
        }    
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
    hide() {        
        this._list.style.display = 'none';                
    }

}

export { ResultView };