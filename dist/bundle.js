/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SearchControl = undefined;
	
	__webpack_require__(1);
	
	var _ResultView = __webpack_require__(6);
	
	var _GmxRenderer = __webpack_require__(7);
	
	var _OsmDataProvider = __webpack_require__(8);
	
	var _CoordinatesDataProvider = __webpack_require__(9);
	
	var _CadastreDataProvider = __webpack_require__(10);
	
	var SearchControl = L.Control.extend({
	    includes: [L.Mixin.Events],
	    initialize: function initialize(options) {
	        L.setOptions(this, options);
	    },
	    _chain: function _chain(tasks, state) {
	        return tasks.reduce(function (prev, next) {
	            return prev.then(next);
	        }, new Promise(function (resolve, reject) {
	            return resolve(state);
	        }));
	    },
	
	    _handleChange: function _handleChange(e) {
	        var _this = this;
	
	        var text = this._input.value;
	        if (text.length) {
	
	            var tasks = this.options.providers.filter(function (provider) {
	                return provider.showSuggestion;
	            }).map(function (provider) {
	                return function (state) {
	                    return new Promise(function (resolve) {
	                        if (_this.options.showFirst && state.completed) {
	                            resolve(state);
	                        } else {
	                            provider.find(text, _this.options.limit, false, false).then(function (response) {
	                                state.completed = _this.options.showFirst && response.length > 0;
	                                state.response = state.response.concat(response);
	                                resolve(state);
	                            });
	                        }
	                    });
	                };
	            });
	
	            this._chain(tasks, { completed: false, response: [] }).then(function (state) {
	                _this.results.show(state.response);
	            });
	        }
	    },
	    _handleMouseMove: function _handleMouseMove(e) {
	        e.stopPropagation();
	    },
	    _search: function _search(text) {
	        var _this2 = this;
	
	        var tasks = this.options.providers.filter(function (provider) {
	            return provider.showOnEnter;
	        }).map(function (provider) {
	            return function (state) {
	                return new Promise(function (resolve) {
	                    if (_this2.options.showFirst && state.completed) {
	                        resolve(state);
	                    } else {
	                        var p = provider.find(text, 1, true, true);
	                        p.then(function (response) {
	                            state.completed = response.length > 0;
	                            state.response = state.response.concat(response);
	                            resolve(state);
	                        });
	                    }
	                });
	            };
	        });
	
	        this._chain(tasks, { completed: false, response: [] }).then(function (state) {
	            var features = state.response.filter(function (x) {
	                return x.provider.showOnMap;
	            }).map(function (x) {
	                return x.feature;
	            });
	            if (features.length) {
	                _this2._renderer.render([features[0]], _this2.options.style);
	            }
	        });
	    },
	    _selectItem: function _selectItem(item) {
	        var _this3 = this;
	
	        item.provider.fetch(item.properties).then(function (response) {
	            if (item.provider.showOnSelect && response.length) {
	                var features = response.filter(function (x) {
	                    return x.provider.showOnMap;
	                }).map(function (x) {
	                    return x.feature;
	                });
	                _this3._renderer.render(features, _this3.options.style);
	            }
	        });
	    },
	    onAdd: function onAdd(map) {
	        this._container = L.DomUtil.create('div', 'leaflet-ext-search');
	        this._container.innerHTML = '<input type="text" value="" placeholder="' + this.options.placeHolder + '" /><span class="leaflet-ext-search-button"></span>';
	        this._input = this._container.querySelector('input');
	        this._input.addEventListener('input', this._handleChange.bind(this));
	        this._input.addEventListener('mousemove', this._handleMouseMove.bind(this));
	
	        this._button = this._container.querySelector('.leaflet-ext-search-button');
	        this._button.addEventListener('click', this._handleSearch.bind(this));
	
	        this.results = new _ResultView.ResultView({
	            input: this._input,
	            onSelect: this._selectItem.bind(this),
	            onEnter: this._search.bind(this)
	        });
	
	        this._renderer = this.options.renderer || new _GmxRenderer.GmxRenderer(map);
	
	        map.on('click', this.results.hide.bind(this.results));
	        return this._container;
	    },
	
	    _handleSearch: function _handleSearch(e) {
	        e.stopPropagation();
	        this._search(this._input.value);
	    },
	
	    addTo: function addTo(map) {
	        L.Control.prototype.addTo.call(this, map);
	        if (this.options.addBefore) {
	            this.addBefore(this.options.addBefore);
	        }
	        return this;
	    },
	
	    addBefore: function addBefore(id) {
	        var parentNode = this._parent && this._parent._container;
	        if (!parentNode) {
	            parentNode = this._map && this._map._controlCorners[this.getPosition()];
	        }
	        if (!parentNode) {
	            this.options.addBefore = id;
	        } else {
	            for (var i = 0, len = parentNode.childNodes.length; i < len; i++) {
	                var it = parentNode.childNodes[i];
	                if (id === it._id) {
	                    parentNode.insertBefore(this._container, it);
	                    break;
	                }
	            }
	        }
	
	        return this;
	    }
	
	});
	
	window.nsGmx = window.nsGmx || {};
	window.nsGmx.SearchControl = SearchControl;
	
	exports.SearchControl = SearchControl;

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ResultView = function () {
	    function ResultView(_ref) {
	        var input = _ref.input,
	            onSelect = _ref.onSelect,
	            onEnter = _ref.onEnter;
	
	        _classCallCheck(this, ResultView);
	
	        this._input = input;
	        this._onSelect = onSelect;
	        this._onEnter = onEnter;
	        this.index = -1;
	        this.count = 0;
	        this._item = null;
	        this._inputText = '';
	        this._list = L.DomUtil.create('div');
	        this._list.setAttribute('class', 'leaflet-ext-search-list noselect');
	
	        this._list.style.top = this._input.offsetTop + this._input.offsetHeight + 2 + 'px';
	        this._list.style.left = this._input.offsetLeft + 'px';
	        this._input.addEventListener('keydown', this._handleKey.bind(this));
	        this._input.addEventListener('click', this._handleInputClick.bind(this));
	        this._input.addEventListener('focus', this._handleFocus.bind(this));
	        this._list.addEventListener('keydown', this._handleKey.bind(this));
	        this._list.addEventListener('wheel', this._handleWheel.bind(this));
	        // this._list.addEventListener('mousemove', this._handleWheel.bind(this));
	        this._input.parentElement.appendChild(this._list);
	        this._input.addEventListener('input', this._handleChange.bind(this));
	    }
	
	    _createClass(ResultView, [{
	        key: '_handleInputClick',
	        value: function _handleInputClick(e) {
	            e.stopPropagation();
	        }
	    }, {
	        key: '_handleFocus',
	        value: function _handleFocus(e) {
	            if (this.index >= 0) {
	                var el = this._list.querySelector('[tabindex="' + this.index + '"]');
	                L.DomUtil.removeClass(el, 'leaflet-ext-search-list-selected');
	            }
	            this.index = -1;
	            this._item = null;
	        }
	    }, {
	        key: '_handleChange',
	        value: function _handleChange(e) {
	            this._inputText = this._input.value;
	        }
	    }, {
	        key: '_handleWheel',
	        value: function _handleWheel(e) {
	            e.stopPropagation();
	        }
	    }, {
	        key: '_handleMouseMove',
	        value: function _handleMouseMove(e) {
	            e.stopPropagation();
	        }
	    }, {
	        key: '_handleKey',
	        value: function _handleKey(e) {
	            if (this.listVisible()) {
	                if (e.key === 'ArrowDown') {
	                    e.preventDefault();
	                    if (this.index < 0) {
	                        this.index = 0;
	                    } else if (0 <= this.index && this.index < this.count - 1) {
	                        var _el = this._list.querySelector('[tabindex="' + this.index + '"]');
	                        L.DomUtil.removeClass(_el, 'leaflet-ext-search-list-selected');
	                        ++this.index;
	                    } else {
	                        var _el2 = this._list.querySelector('[tabindex="' + this.index + '"]');
	                        L.DomUtil.removeClass(_el2, 'leaflet-ext-search-list-selected');
	                        this.index = this.count - 1;
	                    }
	                    var el = this._list.querySelector('[tabindex="' + this.index + '"]');
	                    L.DomUtil.addClass(el, 'leaflet-ext-search-list-selected');
	                    this.selectItem(this.index);
	                    el.focus();
	                } else if (e.key === 'ArrowUp') {
	                    e.preventDefault();
	                    if (this.index > 0) {
	                        var _el3 = this._list.querySelector('[tabindex="' + this.index + '"]');
	                        L.DomUtil.removeClass(_el3, 'leaflet-ext-search-list-selected');
	                        --this.index;
	                        _el3 = this._list.querySelector('[tabindex="' + this.index + '"]');
	                        L.DomUtil.addClass(_el3, 'leaflet-ext-search-list-selected');
	                        this.selectItem(this.index);
	                        _el3.focus();
	                    } else if (this.index === 0) {
	                        this._input.focus();
	                        this._input.value = this._inputText;
	                    }
	                } else if (e.key === 'Enter') {
	                    if (this.index < 0 && this._input.value && typeof this._onEnter == 'function') {
	                        var text = this._input.value;
	                        this._input.focus();
	                        this._input.setSelectionRange(text.length, text.length);
	                        this.hide();
	                        this._onEnter(text);
	                    } else {
	                        this.complete(this.index);
	                    }
	                } else if (e.key === 'Escape') {
	                    if (this.index < 0) {
	                        this.hide();
	                    }
	                    this._input.focus();
	                    this._input.value = this._inputText;
	                }
	            } else {
	                if (e.key === 'Enter' && this._input.value && typeof this._onEnter == 'function') {
	                    var _text = this._input.value;
	                    this._input.setSelectionRange(_text.length, _text.length);
	                    this._onEnter(_text);
	                } else if (e.key === 'Escape') {
	                    this._input.value = '';
	                    this.index = -1;
	                    this._input.focus();
	                }
	            }
	        }
	    }, {
	        key: 'listVisible',
	        value: function listVisible() {
	            return this.count > 0 && this._list.style.display !== 'none';
	        }
	    }, {
	        key: 'selectItem',
	        value: function selectItem(i) {
	            this._item = this._items[i];
	            var text = this._item.name;
	            this._input.value = text;
	            this._input.setSelectionRange(text.length, text.length);
	        }
	    }, {
	        key: '_handleClick',
	        value: function _handleClick(i, e) {
	            e.preventDefault();
	            this.complete(i);
	        }
	    }, {
	        key: 'complete',
	        value: function complete(i) {
	            var item = i >= 0 ? this._items[i] : this._item ? this._item : null;
	            if (item) {
	                this._item = item;
	                this.index = -1;
	                var text = item.name;
	                this._input.value = text;
	                this._input.setSelectionRange(text.length, text.length);
	                this._input.focus();
	                this.hide();
	                if (typeof this._onSelect === 'function') {
	                    this._onSelect(item);
	                }
	            }
	        }
	    }, {
	        key: 'show',
	        value: function show(items) {
	            if (items.length) {
	                this._item = null;
	                this.index = -1;
	                this._items = items;
	                var html = '<ul>' + this._items.map(function (x, i) {
	                    return '<li tabindex=' + i + '>' + x.name + '</li>';
	                }, []).join('') + '</ul>';
	
	                this._list.innerHTML = html;
	                var elements = this._list.querySelectorAll('li');
	                for (var i = 0; i < elements.length; ++i) {
	                    elements[i].addEventListener('click', this._handleClick.bind(this, i));
	                }
	
	                this.count = elements.length;
	                this._list.style.display = 'block';
	            }
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            this._list.style.display = 'none';
	        }
	    }]);
	
	    return ResultView;
	}();
	
	exports.ResultView = ResultView;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GmxRenderer = function () {
	    function GmxRenderer(map) {
	        _classCallCheck(this, GmxRenderer);
	
	        this._map = map;
	        this._gmxDrawing = this._map.gmxDrawing;
	    }
	
	    _createClass(GmxRenderer, [{
	        key: "render",
	        value: function render(features, _style) {
	            var _this = this;
	
	            if (features && features.length) {
	                var json = features.reduce(function (a, geojson) {
	                    L.geoJson(geojson, {
	                        style: function style(feature) {
	                            return _style.lineStyle;
	                        },
	                        onEachFeature: function (feature, layer) {
	                            this._gmxDrawing.add(layer, _style);
	                        }.bind(_this)
	                    });
	                    a.addData(geojson.geometry);
	                    return a;
	                }, L.geoJson());
	                var bounds = json.getBounds();
	                this._map.fitBounds(bounds);
	                this._map.invalidateSize();
	            }
	        }
	    }]);
	
	    return GmxRenderer;
	}();
	
	exports.GmxRenderer = GmxRenderer;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var OsmDataProvider = function () {
	    function OsmDataProvider(_ref) {
	        var serverBase = _ref.serverBase,
	            limit = _ref.limit,
	            onFetch = _ref.onFetch,
	            showOnMap = _ref.showOnMap;
	
	        _classCallCheck(this, OsmDataProvider);
	
	        this._serverBase = serverBase;
	        this._onFetch = onFetch;
	        this.showSuggestion = true;
	        this.showOnMap = showOnMap;
	        this.showOnSelect = true;
	        this.showOnEnter = true;
	        this.find = this.find.bind(this);
	        this.fetch = this.fetch.bind(this);
	        this._convertGeometry = this._convertGeometry.bind(this);
	
	        this._key = window.KOSMOSNIMKI_SESSION_KEY == null || window.KOSMOSNIMKI_SESSION_KEY == 'INVALID' ? '' : '&key=' + window.KOSMOSNIMKI_SESSION_KEY;
	    }
	
	    _createClass(OsmDataProvider, [{
	        key: '_convertGeometry',
	        value: function _convertGeometry(geometry) {
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
	    }, {
	        key: 'fetch',
	        value: function (_fetch) {
	            function fetch(_x) {
	                return _fetch.apply(this, arguments);
	            }
	
	            fetch.toString = function () {
	                return _fetch.toString();
	            };
	
	            return fetch;
	        }(function (obj) {
	            var _this = this;
	
	            var query = 'RequestType=ID&ID=' + obj.ObjCode + '&TypeCode=' + obj.TypeCode + '&UseOSM=1';
	            var req = new Request(this._serverBase + '/SearchObject/SearchAddress.ashx?' + query + this._key);
	            var headers = new Headers();
	            headers.append('Content-Type', 'application/json');
	            var init = {
	                method: 'GET',
	                mode: 'cors',
	                cache: 'default'
	            };
	            return new Promise(function (resolve, reject) {
	                fetch(req, init).then(function (response) {
	                    return response.text();
	                }).then(function (response) {
	                    var json = JSON.parse(response.slice(1, response.length - 1));
	                    if (json.Status === 'ok') {
	                        var rs = json.Result.reduce(function (a, x) {
	                            return a.concat(x.SearchResult);
	                        }, []).map(function (x) {
	                            var g = _this._convertGeometry(x.Geometry);
	                            var props = Object.keys(x).filter(function (k) {
	                                return k !== 'Geometry';
	                            }).reduce(function (a, k) {
	                                a[k] = x[k];
	                                return a;
	                            }, {});
	                            return {
	                                feature: {
	                                    type: 'Feature',
	                                    geometry: g,
	                                    properties: props
	                                },
	                                provider: _this,
	                                query: obj
	                            };
	                        });
	                        if (typeof _this._onFetch === 'function') {
	                            _this._onFetch(rs);
	                        }
	                        resolve(rs);
	                    } else {
	                        reject(json);
	                    }
	                });
	            });
	        })
	    }, {
	        key: 'find',
	        value: function find(value, limit, strong, retrieveGeometry) {
	            var _this2 = this;
	
	            var _strong = Boolean(strong) ? 1 : 0;
	            var _withoutGeometry = Boolean(retrieveGeometry) ? 0 : 1;
	            var query = 'RequestType=SearchObject&IsStrongSearch=' + _strong + '&WithoutGeometry=' + _withoutGeometry + '&UseOSM=1&Limit=' + limit + '&SearchString=' + encodeURIComponent(value);
	            var req = new Request(this._serverBase + '/SearchObject/SearchAddress.ashx?' + query + this._key);
	            var headers = new Headers();
	            headers.append('Content-Type', 'application/json');
	            var init = {
	                method: 'GET',
	                mode: 'cors',
	                cache: 'default'
	            };
	            return new Promise(function (resolve, reject) {
	                fetch(req, init).then(function (response) {
	                    return response.text();
	                }).then(function (response) {
	                    var json = JSON.parse(response.slice(1, response.length - 1));
	                    if (json.Status === 'ok') {
	                        var rs = json.Result.reduce(function (a, x) {
	                            return a.concat(x.SearchResult);
	                        }, []).map(function (x) {
	                            if (retrieveGeometry) {
	                                var g = _this2._convertGeometry(x.Geometry);
	                                var props = Object.keys(x).filter(function (k) {
	                                    return k !== 'Geometry';
	                                }).reduce(function (a, k) {
	                                    a[k] = x[k];
	                                    return a;
	                                }, {});
	                                return {
	                                    feature: {
	                                        type: 'Feature',
	                                        geometry: g,
	                                        properties: props
	                                    },
	                                    provider: _this2,
	                                    query: value
	                                };
	                            } else {
	                                return {
	                                    name: x.ObjNameShort,
	                                    properties: x,
	                                    provider: _this2,
	                                    query: value
	                                };
	                            }
	                        });
	                        if (limit === 1 && strong && retrieveGeometry && typeof _this2._onFetch === 'function') {
	                            _this2._onFetch(rs);
	                        }
	                        resolve(rs);
	                    } else {
	                        reject(json);
	                    }
	                });
	            });
	        }
	    }]);
	
	    return OsmDataProvider;
	}();
	
	window.nsGmx = window.nsGmx || {};
	window.nsGmx.OsmDataProvider = OsmDataProvider;
	
	exports.OsmDataProvider = OsmDataProvider;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CoordinatesDataProvider = function () {
	    function CoordinatesDataProvider(_ref) {
	        var onFetch = _ref.onFetch,
	            showOnMap = _ref.showOnMap;
	
	        _classCallCheck(this, CoordinatesDataProvider);
	
	        this._onFetch = onFetch;
	        this.showSuggestion = false;
	        this.showOnMap = showOnMap;
	        this.showOnSelect = false;
	        this.showOnEnter = true;
	        this.fetch = this.fetch.bind(this);
	        this.find = this.find.bind(this);
	        this.rxLat = new RegExp('(\\d+\\.?\\d+)\\s*(N|S)');
	        this.rxLng = new RegExp('(\\d+\\.?\\d+)\\s*(E|W)');
	    }
	
	    _createClass(CoordinatesDataProvider, [{
	        key: '_parseCoordinates',
	        value: function _parseCoordinates(value) {
	            var _this = this;
	
	            var coords = value.split(/(,|\\s+)/).reduce(function (a, x) {
	                var lat = _this.rxLat.exec(x);
	                if (lat && lat.length) {
	                    a.lat = parseFloat(lat[1]);
	                    if (lat[2] == 'S') {
	                        a.lat = -a.lat;
	                    }
	                }
	                var lng = _this.rxLng.exec(x);
	                if (lng && lng.length) {
	                    a.lng = parseFloat(lng[1]);
	                    if (lng[2] == 'W') {
	                        a.lng = -a.lng;
	                    }
	                }
	                return a;
	            }, {});
	            if (coords.hasOwnProperty('lat') && coords.hasOwnProperty('lng')) {
	                return { type: 'Point', coordinates: [coords.lng, coords.lat] };
	            } else {
	                return null;
	            }
	        }
	    }, {
	        key: 'fetch',
	        value: function fetch(value) {
	            return new Promise(function (resolve) {
	                return resolve([]);
	            });
	        }
	    }, {
	        key: 'find',
	        value: function find(value, limit, strong, retrieveGeometry) {
	            var _this2 = this;
	
	            var g = this._parseCoordinates(value);
	            return new Promise(function (resolve) {
	                var result = { feature: { type: 'Feature', geometry: g, properties: {} }, provider: _this2, query: value };
	                if (g && typeof _this2._onFetch === 'function') {
	                    _this2._onFetch(result);
	                }
	                resolve(g ? [result] : []);
	            });
	        }
	    }]);
	
	    return CoordinatesDataProvider;
	}();
	
	window.nsGmx = window.nsGmx || {};
	window.nsGmx.CoordinatesDataProvider = CoordinatesDataProvider;
	
	exports.CoordinatesDataProvider = CoordinatesDataProvider;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CadastreDataProvider = function () {
	    function CadastreDataProvider(_ref) {
	        var serverBase = _ref.serverBase,
	            limit = _ref.limit,
	            tolerance = _ref.tolerance,
	            onFetch = _ref.onFetch,
	            showOnMap = _ref.showOnMap;
	
	        _classCallCheck(this, CadastreDataProvider);
	
	        this._serverBase = serverBase;
	        this._tolerance = tolerance;
	        this._onFetch = onFetch;
	        this.showSuggestion = true;
	        this.showOnMap = showOnMap;
	        this.showOnSelect = false;
	        this.showOnEnter = false;
	        this._cadastreLayers = [{ id: 1, title: 'Участок', reg: /^\d\d:\d+:\d+:\d+$/ }, { id: 2, title: 'Квартал', reg: /^\d\d:\d+:\d+$/ }, { id: 3, title: 'Район', reg: /^\d\d:\d+$/ }, { id: 4, title: 'Округ', reg: /^\d\d$/ }, { id: 5, title: 'ОКС', reg: /^\d\d:\d+:\d+:\d+:\d+$/ }, { id: 10, title: 'ЗОУИТ', reg: /^\d+\.\d+\.\d+/ }
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
	
	    _createClass(CadastreDataProvider, [{
	        key: 'getCadastreLayer',
	        value: function getCadastreLayer(str, type) {
	            str = str.trim();
	            for (var i = 0, len = this._cadastreLayers.length; i < len; i++) {
	                var it = this._cadastreLayers[i];
	                if (it.id === type) {
	                    return it;
	                }
	                if (it.reg.exec(str)) {
	                    return it;
	                }
	            }
	            return this._cadastreLayers[0];
	        }
	    }, {
	        key: 'find',
	        value: function find(value, limit, strong, retrieveGeometry) {
	            var _this = this;
	
	            var cadastreLayer = this.getCadastreLayer(value);
	            return new Promise(function (resolve) {
	                var req = new Request(_this._serverBase + '/typeahead?limit=' + limit + '&skip=0&text=' + value + '&type=' + cadastreLayer.id);
	                var headers = new Headers();
	                headers.append('Content-Type', 'application/json');
	                var init = {
	                    method: 'GET',
	                    mode: 'cors',
	                    cache: 'default'
	                };
	                fetch(req, init).then(function (response) {
	                    return response.text();
	                }).then(function (response) {
	                    var json = JSON.parse(response);
	                    if (json.status === 200) {
	                        var rs = json.results.map(function (x) {
	                            return {
	                                name: x.title,
	                                properties: x,
	                                provider: _this,
	                                query: value
	                            };
	                        });
	                        resolve(rs);
	                    } else {
	                        resolve(json);
	                    }
	                });
	            });
	        }
	    }, {
	        key: 'fetch',
	        value: function (_fetch) {
	            function fetch(_x) {
	                return _fetch.apply(this, arguments);
	            }
	
	            fetch.toString = function () {
	                return _fetch.toString();
	            };
	
	            return fetch;
	        }(function (obj) {
	            var _this2 = this;
	
	            var cadastreLayer = this.getCadastreLayer(obj.value);
	            return new Promise(function (resolve) {
	                if (cadastreLayer) {
	                    var req = new Request(_this2._serverBase + '/features/' + cadastreLayer.id + '?tolerance=' + _this2._tolerance + '&limit=1&text=' + obj.value);
	                    var headers = new Headers();
	                    headers.append('Content-Type', 'application/json');
	                    var init = {
	                        method: 'GET',
	                        mode: 'cors',
	                        cache: 'default'
	                    };
	                    fetch(req, init).then(function (response) {
	                        return response.text();
	                    }).then(function (response) {
	                        var json = JSON.parse(response);
	                        if (json.status === 200) {
	                            if (typeof _this2._onFetch === 'function') {
	                                _this2._onFetch(json);
	                            }
	                            var rs = json.features.map(function (x) {
	                                return {
	                                    name: x.attrs.name,
	                                    properties: x,
	                                    provider: _this2,
	                                    query: obj
	                                };
	                            });
	                            resolve(rs);
	                        } else {
	                            resolve(json);
	                        }
	                    });
	                } else {
	                    resolve([]);
	                }
	            });
	        })
	    }]);
	
	    return CadastreDataProvider;
	}();
	
	window.nsGmx = window.nsGmx || {};
	window.nsGmx.CadastreDataProvider = CadastreDataProvider;
	
	exports.CadastreDataProvider = CadastreDataProvider;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map