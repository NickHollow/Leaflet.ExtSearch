
function isElementInViewport(rect, view) { 
  return (
    rect.top >= view.top &&
    rect.left >= view.left &&
    rect.bottom <= view.bottom &&
    rect.right <= view.right
  );
}

function scrollIntoView (el, wrap){
    let offset = el.offsetTop - wrap.scrollTop;
    if(offset > wrap.getBoundingClientRect().height){
        wrap.scrollTop = offset;        
    }
}

class ResultView {
    constructor({input}){
        this._input = input;
        this.index = -1;
        this.count = 0;
        this._list = L.DomUtil.create('div');
        L.DomUtil.addClass(this._list, 'leaflet-ext-search-list');
        L.DomUtil.addClass(this._list, 'noselect');

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
            let i = -1;
            if (this.index < 0){
                i = 0;                
            }
            else if (0 <= this.index && this.index < this.count - 1){
                i = this.index + 1;
            }   
            else {
                i = this.count - 1;
            }    
            let item = this._list.querySelector(`[tabindex="${i}"]`);
            item.focus();            
        }
        else if (e.key === 'ArrowUp'){
            e.preventDefault();            
            if(this.index > 0){
                let i = this.index - 1;
                let item = this._list.querySelector(`[tabindex="${i}"]`);        
                item.focus();                                              
            }
            else {
                this.index = -1;
                this._input.focus();                
            }            
        }
        else if (e.key === 'Enter'){
            let item = this._list.querySelector(`[tabindex="${this.index}"]`);            
            this._input.focus();
            this.complete (this._providers[this.index], item.innerText);
        }            
    }

    selectItem(i, text, e){
        this.index = i;
        this._input.value = text;        
        this._input.setSelectionRange(text.length, text.length);
    }

    complete(provider, text){
        this.index = -1;
        this._input.value = text;
        this._input.setSelectionRange(text.length, text.length);        
        this.hide();
        let event = new CustomEvent('item:select', {'detail': {text: text, provider: provider}, bubbles: true, cancelable: true});
        document.dispatchEvent(event);
    }    

    show(values) {
        this._providers = values.map(x => x.target);   
        const html = 
            '<ul>' + values                
            .reduce((a,x) => {
                a.push (x.response.map((z,i) => `<li tabindex=${i}>${z}</li>`).join(''));
                return a;
            }, []).join('') + '</ul>';                            

        this._list.innerHTML = html;
        let items = this._list.querySelectorAll('li');
        for (let i = 0; i < items.length; ++i){
            let item = items[i];
            item.addEventListener('click', this.complete.bind(this, this._providers[i], item.innerText));
            item.addEventListener('focus', this.selectItem.bind(this, i, item.innerText));            
        }
        this.index = -1;
        this.count = items.length;
        this._list.style.display = 'block';
    }
    hide() {
        this._list.style.display = 'none';
    }

}

export { ResultView };