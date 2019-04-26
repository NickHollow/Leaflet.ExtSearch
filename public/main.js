var nsGmx = (function (exports) {
  'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var EventTarget = function () {
      function EventTarget() {
          classCallCheck(this, EventTarget);

          this.listeners = {};
      }

      createClass(EventTarget, [{
          key: 'addEventListener',
          value: function addEventListener(type, callback) {
              if (!(type in this.listeners)) {
                  this.listeners[type] = [];
              }
              this.listeners[type].push(callback);
          }
      }, {
          key: 'on',
          value: function on(type, callback) {
              this.addEventListener(type, callback);
              return this;
          }
      }, {
          key: 'removeEventListener',
          value: function removeEventListener(type, callback) {
              if (!(type in this.listeners)) {
                  return;
              }
              var stack = this.listeners[type];
              for (var i = 0, l = stack.length; i < l; i++) {
                  if (stack[i] === callback) {
                      stack.splice(i, 1);
                      return this.removeEventListener(type, callback);
                  }
              }
          }
      }, {
          key: 'off',
          value: function off(type, callback) {
              this.removeEventListener(type, callback);
              return this;
          }
      }, {
          key: 'dispatchEvent',
          value: function dispatchEvent(event) {
              if (!(event.type in this.listeners)) {
                  return;
              }
              var stack = this.listeners[event.type];
              Object.defineProperty(event, 'target', {
                  enumerable: false,
                  configurable: false,
                  writable: false,
                  value: this
              });
              for (var i = 0, l = stack.length; i < l; i++) {
                  stack[i].call(this, event);
              }
          }
      }]);
      return EventTarget;
  }();

  var scanexEventTarget_cjs = EventTarget;

  class ResultView extends scanexEventTarget_cjs {
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

  function chain (tasks, state) {
      return tasks.reduce(
          (prev, next) => prev.then(next),
          new Promise ((resolve, reject) => resolve (state))
      );
  }

  class SearchWidget extends scanexEventTarget_cjs {
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

  class OsmDataProvider extends scanexEventTarget_cjs {
      constructor({serverBase}){
          super();
          this._serverBase = serverBase;             
          this.showSuggestion = true;    
          this.showOnSelect = true;
          this.showOnEnter = true;
          this.find = this.find.bind(this);
          this.fetch = this.fetch.bind(this);
          this._convertGeometry = this._convertGeometry.bind(this);

          this._key = window.KOSMOSNIMKI_SESSION_KEY == null || window.KOSMOSNIMKI_SESSION_KEY == 'INVALID' ? '' : `&key=${window.KOSMOSNIMKI_SESSION_KEY}`;
      }
      _convertGeometry(geometry) {        
          switch (geometry.type.toUpperCase()) {
              case 'POINT':
                  geometry.type = 'Point';
                  break;
              case 'POLYGON':
                  geometry.type = 'Polygon';
                  break;
              case 'MULTIPOLYGON':
                  geometry.type = 'MultiPolygon';
                  break;
              case 'LINESTRING':
              case 'POLYLINE':
                  geometry.type = 'LineString';
                  break;
              case 'MULTILINESTRING':
                  geometry.type = 'MultiLineString';
                  break;
              default:
                  throw 'Unknown WKT type';
          }
          return geometry;
      }
      fetch (obj) {
          const query = `WrapStyle=None&RequestType=ID&ID=${obj.ObjCode}&TypeCode=${obj.TypeCode}&UseOSM=1`;        
          let req = new Request(`${this._serverBase}/SearchObject/SearchAddress.ashx?${query}${this._key}`);
          let headers = new Headers();
          headers.append('Content-Type','application/json');        
          let init = {
              method: 'GET',            
              mode: 'cors',
              credentials: 'include',        
              cache: 'default',
          };
          return new Promise((resolve, reject) => {
              fetch (req, init)
              .then(response => response.json())
              .then(json => {
                  if(json.Status === 'ok'){
                      const rs = json.Result
                      .reduce((a,x) => a.concat(x.SearchResult), [])
                      .map(x => {
                          let g = this._convertGeometry (x.Geometry);
                          let props = Object.keys(x)
                          .filter(k => k !== 'Geometry')
                          .reduce((a,k) => {
                              a[k] = x[k];
                              return a;
                          }, {});
                          return {
                              feature: {
                                  type: 'Feature',
                                  geometry: g,
                                  properties: props,                            
                              },
                              provider: this,
                              query: obj,
                          };
                      });
                      let event = document.createEvent('Event');
                      event.initEvent('fetch', false, false);
                      event.detail = rs;
                      this.dispatchEvent(event);
                      resolve(rs);
                  }
                  else {
                      reject(json);
                  }                
              })
              .catch(response => reject(response));
          });
      }
      find(value, limit, strong, retrieveGeometry){                
          return new Promise((resolve, reject) => {
              if (value || value.trim()) {
                  const _strong = Boolean(strong) ? 1 : 0;
                  const _withoutGeometry = Boolean(retrieveGeometry) ? 0 : 1; 
                  const query = `WrapStyle=None&RequestType=SearchObject&IsStrongSearch=${_strong}&WithoutGeometry=${_withoutGeometry}&UseOSM=1&Limit=${limit}&SearchString=${encodeURIComponent(value)}`;        
                  let req = new Request(`${this._serverBase}/SearchObject/SearchAddress.ashx?${query}${this._key}`);
                  let headers = new Headers();
                  headers.append('Content-Type','application/json');        
                  let init = {
                      method: 'GET',
                      mode: 'cors', 
                      credentials: 'include',
                      cache: 'default',
                  };
                  fetch (req, init)
                  .then(response => response.json())
                  .then(json => {                
                      if(json.Status === 'ok'){                    
                          const rs = json.Result
                          .reduce((a,x) => a.concat(x.SearchResult), [])
                          .map(x => {
                              if (retrieveGeometry && x.Geometry) {
                                  let g = this._convertGeometry (x.Geometry);
                                  let props = Object.keys(x)
                                  .filter(k => k !== 'Geometry')
                                  .reduce((a,k) => {
                                      a[k] = x[k];
                                      return a;
                                  }, {});
                                  return {
                                      name: x.ObjNameShort,
                                      feature: {
                                          type: 'Feature',
                                          geometry: g,
                                          properties: props,                            
                                      },
                                      properties: props,
                                      provider: this,
                                      query: value,
                                  };
                              }
                              else {
                                  return {
                                      name: x.ObjNameShort,
                                      properties: x,
                                      provider: this,
                                      query: value,
                                  };
                              }                        
                          });
                          if (strong && retrieveGeometry) {                        
                              let event = document.createEvent('Event');
                              event.initEvent('fetch', false, false);
                              event.detail = rs;
                              this.dispatchEvent(event);
                          }
                          resolve(rs);
                      }
                      else {
                          reject(json);
                      }                
                  })
                  .catch(response => reject(response));

              }
              else {
                  reject('Empty string');
              }                        
          });
      }
  }

  class CoordinatesDataProvider extends scanexEventTarget_cjs {
      constructor(){
          super();        
          this.showSuggestion = false;        
          this.showOnSelect = false;
          this.showOnEnter = true;
          this.fetch = this.fetch.bind(this);
          this.find = this.find.bind(this);        

          this.rxF = new RegExp('^\\s*\\-?(\\d+(\\.\\d+)?)(\\s+[N|S])?(,\\s*|\\s+)\\-?(\\d+(\\.\\d+)?)(\\s+[E|W])?');
          this.rxD = new RegExp('^\\s*(\\d{1,2})[\\s|\\u00b0](\\d{1,2})[\\s|\\u0027](\\d{1,2}\\.\\d+)\\u0022?(\\s+[N|S])?,?\\s+(\\d{1,2})[\\s|\\u00b0](\\d{1,2})[\\s|\\u0027](\\d{1,2}\\.\\d+)\\u0022?(\\s+[E|W])?');
      }
      _parseCoordinates(value) {
          let m = this.rxD.exec(value);
          if (Array.isArray(m) && m.length === 9) {
              return this._parseDegrees ([m[1],m[2],m[3],m[5],m[6],m[7]].map(x => parseFloat(x)));
          }
          m = this.rxF.exec(value);
          if (Array.isArray (m) && m.length === 8){
              return {type: 'Point', coordinates: [
                  parseFloat(m[5]),
                  parseFloat(m[1])
              ]};
          }
          
          return null;               
      }
      _parseDegrees ([latDeg, latMin, latSec, lngDeg, lngMin, lngSec]) {    
          return {type: 'Point', coordinates: [
              lngDeg + lngMin / 60 + lngSec / 3600,
              latDeg + latMin / 60 + latSec / 3600
          ]};
      }
      fetch (value){
          return new Promise(resolve => resolve([]));
      }
      find(value, limit, strong, retrieveGeometry){        
          let g = this._parseCoordinates(value);        
          return new Promise(resolve => {
              let result = {feature: { type: 'Feature', geometry: g, properties: {} }, provider: this, query: value};
              if (g) {
                  let event = document.createEvent('Event');
                  event.initEvent('fetch', false, false);
                  event.detail = result;
                  this.dispatchEvent(event);
              }             
              resolve(g ? [result] : []);
          });
      }
  }

  class CadastreDataProvider extends scanexEventTarget_cjs {
      constructor({serverBase, tolerance}){
          super();
          this._serverBase = serverBase;        
          this._tolerance = tolerance;        
          this.showSuggestion = true;
          this.showOnSelect = false;
          this.showOnEnter = true;
          this._cadastreLayers = [
  			{id: 1, title: 'Участок', 	reg: /^\d\d:\d+:\d+:\d+$/},
  			{id: 2, title: 'Квартал',	reg: /^\d\d:\d+:\d+$/},
  			{id: 3, title: 'Район', 	reg: /^\d\d:\d+$/},
  			{id: 4, title: 'Округ', 	reg: /^\d\d$/},
              {id: 5, title: 'ОКС', 		reg: /^\d\d:\d+:\d+:\d+:\d+$/},
  			{id: 10, title: 'ЗОУИТ', 	reg: /^\d+\.\d+\.\d+/}
  			// ,
  			// {id: 7, title: 'Границы', 	reg: /^\w+$/},
  			// {id: 6, title: 'Тер.зоны', 	reg: /^\w+$/},
  			// {id: 12, title: 'Лес', 		reg: /^\w+$/},
  			// {id: 13, title: 'Красные линии', 		reg: /^\w+$/},
  			// {id: 15, title: 'СРЗУ', 	reg: /^\w+$/},
  			// {id: 16, title: 'ОЭЗ', 		reg: /^\w+$/},
  			// {id: 9, title: 'ГОК', 		reg: /^\w+$/},
  			// {id: 10, title: 'ЗОУИТ', 	reg: /^\w+$/}
  			// /[^\d\:]/g,
  			// /\d\d:\d+$/,
  			// /\d\d:\d+:\d+$/,
  			// /\d\d:\d+:\d+:\d+$/
  		];
      }    
      getCadastreLayer (str, type) {
          str = str.trim();
          for (var i = 0, len = this._cadastreLayers.length; i < len; i++) {
              var it = this._cadastreLayers[i];
              if (it.id === type) { return it; }
              if (it.reg.exec(str)) { return it; }
          }
          return this._cadastreLayers[0];
      }
      find(value, limit, strong, retrieveGeometry){   
          const cadastreLayer = this.getCadastreLayer(value);    
          return new Promise(resolve => {
              // let req = new Request(`${this._serverBase}/typeahead?limit=${limit}&skip=0&text=${value}&type=${cadastreLayer.id}`);
              let req = new Request(`${this._serverBase}/features/${cadastreLayer.id}?text=${value}&tolerance=${this._tolerance}&limit=${limit}`);
              let headers = new Headers();
              headers.append('Content-Type','application/json');            
              let init = {
                  method: 'GET',            
                  mode: 'cors',                
                  cache: 'default',
              };
              fetch (req, init)
              .then(response => response.json())
              .then(json => {
                  // if(json.status === 200){
                      let rs = json.features.map(x => {
                          return {
                              name: x.attrs.name || x.attrs.cn || x.attrs.id,
                              properties: x,
                              provider: this,
                              query: value,
                          };
                      });
                      resolve(rs);
                  // }
                  // else {
                      // resolve(json);
                  // }                                       
                                      
              });
          });
      }
      fetch(obj) {
  		var text = obj.attrs.name || obj.attrs.cn || obj.attrs.id;
          const cadastreLayer = this.getCadastreLayer(text, obj.type);
          return new Promise(resolve => {
              if(cadastreLayer) {
                  // let req = new Request(`${this._serverBase}/features/${cadastreLayer.id}?tolerance=${this._tolerance}&limit=1&text=${obj.value}`);
                  let req = new Request(`${this._serverBase}/features/${cadastreLayer.id}?tolerance=${this._tolerance}&limit=1&text=${text}`);
                  let headers = new Headers();
                  headers.append('Content-Type','application/json');
                  let init = {
                      method: 'GET',            
                      mode: 'cors',                    
                      cache: 'default',
                  };
                  fetch (req, init)
                  .then(response => response.json())
                  .then(json => {
                      if(json.status === 200) {
                          let event = document.createEvent('Event');
                          event.initEvent('fetch', false, false);
                          event.detail = json;
                          this.dispatchEvent(event);
                          
                          let rs = json.features.map(x => {
                              return {
                                  name: x.attrs.name || x.attrs.cn || x.attrs.id,
                                  properties: x,
                                  provider: this,
                                  query: obj,
                              };
                              
                          });
                          resolve(rs);

                      }
                      else {
                          resolve(json);
                      }                                        
                  });
              }
              else {
                  resolve([]);
              }            
          });
      }
  }

  exports.CadastreDataProvider = CadastreDataProvider;
  exports.CoordinatesDataProvider = CoordinatesDataProvider;
  exports.OsmDataProvider = OsmDataProvider;
  exports.SearchControl = SearchControl;
  exports.SearchWidget = SearchWidget;

  return exports;

}({}));
//# sourceMappingURL=main.js.map
