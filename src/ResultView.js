
class ResultView {
    constructor({input}){
        this.input = input;        
        this.popup = document.createElement('div');
        this.popup.setAttribute('class', 'leaflet-ext-search-popup');        
        this.popup.style.top = `${this.input.offsetTop + this.input.offsetHeight + 2}px`;
        this.popup.style.left = `${this.input.offsetLeft}px`;
        this.handleKeypress = this.handleKeypress.bind(this);
        this.input.addEventListener('keydown', this.handleKeypress);
        document.body.appendChild(this.popup);
    }

    handleKeypress(e){
        if(e.key === 'ArrowDown'){
            this.popup.querySelector('li').click();
        }   
    }

    handleClick(e){
        let event = new CustomEvent('item:click', {'detail': e.target.innerText, bubbles: true, cancelable: true});        
        document.dispatchEvent(event);
    }
    show(values) {
        const html = 
            '<ul>' + values                
            .reduce((a,x) => {
                a.push (x.response.map(z => `<li>${z}</li>`).join(''));
                return a;
            }, []).join('') + '</ul>';                            

        this.popup.innerHTML = html;
        let items = this.popup.querySelectorAll('li');
        for (let i = 0; i < items.length; ++i){
            items[i].addEventListener('click', this.handleClick);
        }
        this.popup.style.display = 'block';
    }
    hide() {
        // this.popup.style.display = 'none';
    }

}

export { ResultView };