class ResultView {
    constructor({input}){
        this._input = input;
        this.index = -1;
        this.count = 0;
        this._item = null;

        this._list = L.DomUtil.create('div');
        this._list.setAttribute('class', 'leaflet-ext-search-list noselect');        

        this._list.style.top = `${this._input.offsetTop + this._input.offsetHeight + 2}px`;
        this._list.style.left = `${this._input.offsetLeft}px`;
        this._input.addEventListener('keydown', this.handleKey.bind(this));
        this._list.addEventListener('keydown', this.handleKey.bind(this));
        this._list.addEventListener('wheel', this.handleWheel.bind(this));
        this._input.parentElement.appendChild(this._list);        
    }

    handleWheel (e) {
        e.stopPropagation();
    }

    handleKey(e){                         
        if(e.key === 'ArrowDown'){
            e.preventDefault();            
            if (this.index < 0){
                this.index = 0;
            }
            else if (0 <= this.index && this.index < this.count - 1){
                ++this.index;
            }   
            else {
                this.index = this.count - 1;
            }            
            let item = this._list.querySelector(`[tabindex="${this.index}"]`);
            item.focus();            
        }
        else if (e.key === 'ArrowUp'){
            e.preventDefault();            
            if(this.index > 0){
                --this.index;                
                let item = this._list.querySelector(`[tabindex="${this.index}"]`);        
                item.focus();                                              
            }
            else {
                this.index = -1;                
                this._input.focus();                
            }            
        }
        else if (e.key === 'Enter'){
            this.complete (this.index);            
        }    
    }

    selectItem(i, e){
        this._item = this._items[i];        
        const text = this._item.properties.ObjName;
        this._input.value = text;        
        this._input.setSelectionRange(text.length, text.length);        
    }

    complete(i, e){
        let item = i >= 0 ? this._items[i] : this._item ? this._item : null;
        if(item) {
            this._item = item;        
            this.index = -1;            
            const text = item.properties.ObjName;
            this._input.value = text;
            this._input.setSelectionRange(text.length, text.length);                          
            this._input.focus();
            this.hide();
            let event = new CustomEvent('item:select', {detail: item, bubbles: true, cancelable: true});
            document.dispatchEvent(event);            
        }
    }

    show(entries) {
        this._item = null;
        this.index = -1;

        this._items = entries.reduce((a,x) => {
            const items = x.items.map(z => {
                return {provider: x.provider, properties: z};
            });
            return a.concat(items);
        }, []);   
        const html = 
            '<ul>' + this._items         
            .map((x,i) => {
                return `<li tabindex=${i}>${x.properties.ObjNameShort}</li>`;                
            }, []).join('') + '</ul>';                            

        this._list.innerHTML = html;
        let items = this._list.querySelectorAll('li');
        for (let i = 0; i < items.length; ++i){
            let item = items[i];
            item.addEventListener('click', this.complete.bind(this, i));
            item.addEventListener('focus', this.selectItem.bind(this, i));            
        }
        
        this.count = items.length;
        this._list.style.display = 'block';
    }
    hide() {        
        this._list.style.display = 'none';                
    }

}

export { ResultView };