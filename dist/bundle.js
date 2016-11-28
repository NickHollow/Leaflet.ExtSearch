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
	
	var _ResultView = __webpack_require__(5);
	
	var _GmxRenderer = __webpack_require__(6);
	
	var _OsmDataProvider = __webpack_require__(10);
	
	var _CoordinatesDataProvider = __webpack_require__(11);
	
	var _CadastreDataProvider = __webpack_require__(12);
	
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
	
	            var tasks = this.options.providers.map(function (provider) {
	                return function (state) {
	                    return new Promise(function (resolve) {
	                        if (_this.options.showFirst && state.completed) {
	                            resolve(state);
	                        } else {
	                            var p = provider.showSuggestion ? provider.find(text, _this.options.limit, false, false) : provider.fetch(text);
	                            p.then(function (response) {
	                                state.completed = _this.options.showFirst && response.length;
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
	                _this._renderer.render(features, _this.options.style);
	
	                if (features.length == 0) {
	                    var entries = state.response.filter(function (x) {
	                        return x.provider.showSuggestion;
	                    });
	                    _this.results.show(entries);
	                }
	            });
	        }
	    },
	    _handleMouseMove: function _handleMouseMove(e) {
	        e.stopPropagation();
	    },
	    _search: function _search(text) {
	        var _this2 = this;
	
	        var tasks = this.options.providers.filter(function (provider) {
	            return provider.showOnSelect;
	        }).map(function (provider) {
	            return function (state) {
	                return new Promise(function (resolve) {
	                    if (_this2.options.showFirst && state.completed) {
	                        resolve(state);
	                    } else {
	                        var p = provider.find(text, 1, true, true);
	                        p.then(function (response) {
	                            state.completed = response.length;
	                            state.response = state.response.concat(response);
	                            resolve(state);
	                        });
	                    }
	                });
	            };
	        });
	
	        this._chain(tasks, { completed: false, response: [] }).then(function (state) {
	            var features = state.response.map(function (x) {
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
	                var features = response.map(function (x) {
	                    return x.feature;
	                });
	                _this3._renderer.render(features, _this3.options.style);
	            }
	        });
	    },
	    onAdd: function onAdd(map) {
	        this._container = L.DomUtil.create('div', 'leaflet-ext-search');
	        this._container.innerHTML = '<input type="text" value="" />';
	        this._input = this._container.querySelector('input');
	
	        // const style = getComputedStyle (map._container);
	        // const matches = (/\d+/g).exec (style.width);
	        // if(matches && matches.length){
	        //     const width = Number.parseInt (matches[0]) - 50;
	        //     this._input.style.width = `${width}px`;
	        // }
	
	        this._input.addEventListener('input', this._handleChange.bind(this));
	        this._input.addEventListener('mousemove', this._handleMouseMove.bind(this));
	
	        this.results = new _ResultView.ResultView({
	            input: this._input,
	            onSelect: this._selectItem.bind(this),
	            onSearch: this._search.bind(this)
	        });
	
	        this._renderer = this.options.renderer || new _GmxRenderer.GmxRenderer(map);
	
	        return this._container;
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
/* 5 */
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
	            onSearch = _ref.onSearch;
	
	        _classCallCheck(this, ResultView);
	
	        this._input = input;
	        this._onSelect = onSelect;
	        this._onSearch = onSearch;
	        this.index = -1;
	        this.count = 0;
	        this._item = null;
	        this._inputText = '';
	        this._list = L.DomUtil.create('div');
	        this._list.setAttribute('class', 'leaflet-ext-search-list noselect');
	
	        this._list.style.top = this._input.offsetTop + this._input.offsetHeight + 2 + 'px';
	        this._list.style.left = this._input.offsetLeft + 'px';
	        this._input.addEventListener('keydown', this._handleKey.bind(this));
	        this._list.addEventListener('keydown', this._handleKey.bind(this));
	        this._list.addEventListener('wheel', this._handleWheel.bind(this));
	        // this._list.addEventListener('mousemove', this._handleWheel.bind(this));
	        this._input.parentElement.appendChild(this._list);
	        this._input.addEventListener('input', this._handleChange.bind(this));
	    }
	
	    _createClass(ResultView, [{
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
	                        var _el4 = this._list.querySelector('[tabindex="' + this.index + '"]');
	                        L.DomUtil.removeClass(_el4, 'leaflet-ext-search-list-selected');
	                        this.index = -1;
	                        this._input.focus();
	                        this._input.value = this._inputText;
	                        this._item = null;
	                    }
	                } else if (e.key === 'Enter') {
	                    if (this.index < 0 && this._input.value && typeof this._onSearch == 'function') {
	                        var text = this._input.value;
	                        this.index = -1;
	                        this._item = null;
	                        this._input.focus();
	                        this._input.setSelectionRange(text.length, text.length);
	                        this.hide();
	                        this._onSearch(text);
	                    } else {
	                        this.complete(this.index);
	                    }
	                }
	            } else if (e.key === 'Enter' && this._input.value && typeof this._onSearch == 'function') {
	                var _text = this._input.value;
	                this._input.setSelectionRange(_text.length, _text.length);
	                this._onSearch(_text);
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.GmxRenderer = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(7);
	
	__webpack_require__(8);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GmxRenderer = function () {
	    function GmxRenderer(map) {
	        _classCallCheck(this, GmxRenderer);
	
	        this._map = map;
	        this._gmxDrawing = new L.GmxDrawing();
	        this._gmxDrawing.initialize(map);
	    }
	
	    _createClass(GmxRenderer, [{
	        key: 'render',
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
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	!function () {
	  var t = 1e-7,
	      e = "1.0.0";L.GmxDrawing = L.Class.extend({ options: { type: "" }, includes: L.Mixin.Events, initialize: function initialize(t) {
	      if (this._map = t, this.items = [], this.current = null, L.gmxUtil && L.gmxUtil.prettifyDistance) {
	        var e = document.createElementNS(L.Path.SVG_NS, "g");L.DomUtil.addClass(e, "gmxTooltip");var i = document.createElementNS(L.Path.SVG_NS, "rect");i.setAttributeNS(null, "rx", 4), i.setAttributeNS(null, "ry", 4), i.setAttributeNS(null, "height", 16), L.DomUtil.addClass(i, "gmxTooltipBG");var n = document.createElementNS(L.Path.SVG_NS, "text"),
	            o = L.DomUtil.testProp(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]);n.style[o] = "none", e.appendChild(i), e.appendChild(n), this.hideTooltip = function () {
	          e.setAttributeNS(null, "visibility", "hidden");
	        }, this.showTooltip = function (t, o) {
	          var s = t.x + 11,
	              l = t.y - 14;n.setAttributeNS(null, "x", s), n.setAttributeNS(null, "y", l), n.textContent = o, "visible" !== e.getAttributeNS(null, "visibility") && (this._map._pathRoot.appendChild(e), e.setAttributeNS(null, "visibility", "visible"));var a = n.getComputedTextLength();i.setAttributeNS(null, "width", a + 8), i.setAttributeNS(null, "x", s - 4), i.setAttributeNS(null, "y", l - 12);
	        };
	      }var s = function s(t) {
	        this._drawMode = t.mode;
	      };this.on("drawstop drawstart", s);
	    }, bringToFront: function bringToFront() {
	      for (var t = 0, e = this.items.length; e > t; t++) {
	        var i = this.items[t];i._map && "bringToFront" in i && i.bringToFront();
	      }
	    }, addGeoJSON: function addGeoJSON(t, e) {
	      var i = [],
	          n = t instanceof L.GeoJSON;if (n || (t = L.geoJson(t, e)), t instanceof L.GeoJSON) {
	        var o = t.getLayers();if (o) for (var s = function s(t) {
	          var n = null;if (t.setStyle && e && e.lineStyle) {
	            n = {};for (var o in e.lineStyle) {
	              n[o] = e.lineStyle[o];
	            }t.setStyle(e.lineStyle);
	          }var s = this.add(t, e);s._originalStyle = n, i.push(s);
	        }, l = 0, a = o.length; a > l; l++) {
	          var r = o[l];"GeometryCollection" !== r.feature.geometry.type && (r = L.layerGroup([r])), r.eachLayer(s, this);
	        }
	      }return i;
	    }, add: function add(t, e) {
	      var i = null;if (t) {
	        if (t instanceof L.GmxDrawing.Feature) i = t;else {
	          var n = {};if (e && "editable" in e || (n.editable = !0), t.geometry ? n.type = t.geometry.type : t instanceof L.Rectangle ? n.type = "Rectangle" : t instanceof L.Polygon ? n.type = "Polygon" : t instanceof L.MultiPolygon ? n.type = "MultiPolygon" : t instanceof L.Polyline ? n.type = "Polyline" : t instanceof L.MultiPolyline ? n.type = "MultiPolyline" : t instanceof L.Marker && (n.type = "Point", n.editable = !1, t.options.draggable = !0), e = this._chkDrawOptions(n.type, e), L.extend(e, n), t.geometry) {
	            var o = e.markerStyle && e.markerStyle.iconStyle;return "Point" === e.type && !e.pointToLayer && o && (e.icon = L.icon(o), e.pointToLayer = function (t, i) {
	              return new L.Marker(i, e);
	            }), this.addGeoJSON(t, e);
	          }i = new L.GmxDrawing.Feature(this, t, e);
	        }"map" in e || (e.map = !0), e.map && !i._map ? this._map.addLayer(i) : this._addItem(i), "setEditMode" in i && i.setEditMode();
	      }return i;
	    }, _disableDrag: function _disableDrag() {
	      this._map.dragging.disable(), L.DomUtil.disableTextSelection(), L.DomUtil.disableImageDrag(), this._map.doubleClickZoom.removeHooks();
	    }, _enableDrag: function _enableDrag() {
	      this._map.dragging.enable(), L.DomUtil.enableTextSelection(), L.DomUtil.enableImageDrag(), this._map.doubleClickZoom.addHooks();
	    }, _clearCreate: function _clearCreate() {
	      this._createKey && ("Rectangle" === this._createKey.type && L.Browser.mobile ? L.DomEvent.off(this._map._container, "touchstart", this._createKey.fn, this) : this._map.off(this._createKey.eventName, this._createKey.fn, this), this._enableDrag()), this._createKey = null;
	    }, _chkDrawOptions: function _chkDrawOptions(t, e) {
	      var i = L.GmxDrawing.utils.defaultStyles,
	          n = {};if (e || (e = L.extend({}, i)), "Point" === t ? L.extend(n, i.markerStyle.options.icon, e) : (L.extend(n, e), n.lineStyle = L.extend({}, i.lineStyle, e.lineStyle), n.pointStyle = L.extend({}, i.pointStyle, e.pointStyle), n.holeStyle = L.extend({}, i.holeStyle, e.holeStyle)), n.iconUrl) {
	        var o = { iconUrl: n.iconUrl };delete n.iconUrl, n.iconAnchor && (o.iconAnchor = n.iconAnchor, delete n.iconAnchor), n.iconSize && (o.iconSize = n.iconSize, delete n.iconSize), n.popupAnchor && (o.popupAnchor = n.popupAnchor, delete n.popupAnchor), n.shadowSize && (o.shadowSize = n.shadowSize, delete n.shadowSize), n.markerStyle = { iconStyle: o };
	      }return n;
	    }, create: function create(e, i) {
	      if (this._clearCreate(null), e) {
	        var n = this._map,
	            o = this._chkDrawOptions(e, i),
	            s = this;"Rectangle" === e && (n._initPathRoot(), n.dragging.disable()), this._createKey = { type: e, eventName: "Rectangle" === e ? L.Browser.mobile ? "touchstart" : "mousedown" : "click", fn: function fn(i) {
	            s._createType = "";var n,
	                l,
	                a = {},
	                r = i.latlng;for (l in o) {
	              l in L.GmxDrawing.utils.defaultStyles || (a[l] = o[l]);
	            }if ("Point" === e) {
	              var h = o.markerStyle || {},
	                  p = { draggable: !0 };i && i.originalEvent && (p.ctrlKey = i.originalEvent.ctrlKey, p.shiftKey = i.originalEvent.shiftKey, p.altKey = i.originalEvent.altKey), h.iconStyle && (p.icon = L.icon(h.iconStyle)), n = s.add(L.marker(r, p), a);
	            } else o.pointStyle && (a.pointStyle = o.pointStyle), o.lineStyle && (a.lineStyle = o.lineStyle), "Rectangle" === e ? (a.mode = "edit", n = s.add(L.rectangle(L.latLngBounds(L.latLng(r.lat + t, r.lng - t), r)), a), L.Browser.mobile ? n._startTouchMove(i, !0) : n._pointDown(i), n.rings[0].ring._drawstop = !0) : "Polygon" === e ? (a.mode = "add", n = s.add(L.polygon([r]), a), n.setAddMode()) : "Polyline" === e && (a.mode = "add", n = s.add(L.polyline([r]), a).setAddMode());s._clearCreate();
	          } }, "Rectangle" === e && L.Browser.mobile ? L.DomEvent.on(n._container, "touchstart", this._createKey.fn, this) : n.on(this._createKey.eventName, this._createKey.fn, this), this._createType = e, L.DomUtil.addClass(n._mapPane, "leaflet-clickable"), this.fire("drawstart", { mode: e });
	      }this.options.type = e;
	    }, extendDefaultStyles: function extendDefaultStyles(t) {
	      var e = L.GmxDrawing.utils.defaultStyles;if (t = t || {}, t.iconUrl) {
	        var i = e.markerStyle.options.icon;i.iconUrl = t.iconUrl, delete t.iconUrl, t.iconAnchor && (i.iconAnchor = t.iconAnchor, delete t.iconAnchor), t.iconSize && (i.iconSize = t.iconSize, delete t.iconSize), t.popupAnchor && (i.popupAnchor = t.popupAnchor, delete t.popupAnchor), t.shadowSize && (i.shadowSize = t.shadowSize, delete t.shadowSize);
	      }return t.lineStyle && (L.extend(e.lineStyle, t.lineStyle), delete t.lineStyle), t.pointStyle && (L.extend(e.pointStyle, t.pointStyle), delete t.pointStyle), t.holeStyle && (L.extend(e.holeStyle, t.holeStyle), delete t.holeStyle), L.extend(e, t), this;
	    }, getFeatures: function getFeatures() {
	      for (var t = [], e = 0, i = this.items.length; i > e; e++) {
	        t.push(this.items[e]);
	      }return t;
	    }, loadState: function loadState(t) {
	      var e = this,
	          i = t.featureCollection;L.geoJson(i, { onEachFeature: function onEachFeature(t, i) {
	          var n = t.properties,
	              o = n.popupOpened;if ("Rectangle" === n.type) i = L.rectangle(i.getBounds());else if ("Point" === n.type) {
	            n = n.options;var s = n.icon;s && (delete n.icon, s.iconUrl && (n.icon = L.icon(s))), i = L.marker(i.getLatLng(), n);
	          }i.setStyle && n && n.lineStyle && i.setStyle(n.lineStyle), e.add(i, n), o && i.openPopup();
	        } });
	    }, saveState: function saveState() {
	      for (var t = L.featureGroup(), i = [], n = 0, o = this.items.length; o > n; n++) {
	        var s = this.items[n];if ("Point" === s.options.type) {
	          var l = s.toGeoJSON();l.properties = L.GmxDrawing.utils.getNotDefaults(s.options, L.GmxDrawing.utils.defaultStyles.markerStyle), s._map ? s._map.hasLayer(s.getPopup()) && (l.properties.popupOpened = !0) : l.properties.map = !1;var a = L.GmxDrawing.utils.getNotDefaults(s._obj.options, L.GmxDrawing.utils.defaultStyles.markerStyle.options);Object.keys(a).length && (l.properties.options = a), a = L.GmxDrawing.utils.getNotDefaults(s._obj.options.icon.options, L.GmxDrawing.utils.defaultStyles.markerStyle.options.icon), Object.keys(a).length && (l.properties.options || (l.properties.options = {}), l.properties.options.icon = a), i.push(l);
	        } else t.addLayer(s);
	      }var r = t.toGeoJSON();return r.features = r.features.concat(i), { version: e, featureCollection: r };
	    }, _addItem: function _addItem(t) {
	      for (var e = !0, i = 0, n = this.items.length; n > i; i++) {
	        var o = this.items[i];if (o === t) {
	          e = !1;break;
	        }
	      }e && this.items.push(t), this.fire("add", { mode: t.mode, object: t });
	    }, _removeItem: function _removeItem(t, e) {
	      for (var i = 0, n = this.items.length; n > i; i++) {
	        var o = this.items[i];if (o === t) {
	          if (e) {
	            this.items.splice(i, 1);var s = { type: o.options.type, mode: o.mode, object: o };this.fire("remove", s), o.fire("remove", s);
	          }return o;
	        }
	      }return null;
	    }, clear: function clear() {
	      for (var t = 0, e = this.items.length; e > t; t++) {
	        var i = this.items[t];i && i._map && i._map.removeLayer(i);var n = { type: i.options.type, mode: i.mode, object: i };this.fire("remove", n), i.fire("remove", n);
	      }return this.items = [], this;
	    }, remove: function remove(t) {
	      var e = this._removeItem(t, !0);return e && e._map && e._map.removeLayer(e), e;
	    } }), L.Map.addInitHook(function () {
	    this.gmxDrawing = new L.GmxDrawing(this), L.Mixin.ContextMenu && L.GmxDrawing.PointMarkers.include(L.Mixin.ContextMenu);
	  });
	}(), L.GmxDrawing.Feature = L.LayerGroup.extend({ options: { mode: "" }, includes: L.Mixin.Events, simplify: function simplify() {
	    var t, e, i, n, o;for (t = 0, i = this.rings.length; i > t; t++) {
	      var s = this.rings[t],
	          l = s.ring;for (l.setLatLngs(l.points.getPathLatLngs()), e = 0, n = s.holes.length; n > e; e++) {
	        o = s.holes[e], o.setLatLngs(o.points.getPathLatLngs());
	      }
	    }return this;
	  }, bringToFront: function bringToFront() {
	    return this.invoke("bringToFront");
	  }, bringToBack: function bringToBack() {
	    return this.invoke("bringToBack");
	  }, onAdd: function onAdd(t) {
	    if (L.LayerGroup.prototype.onAdd.call(this, t), this._parent._addItem(this), "Point" === this.options.type) {
	      t.addLayer(this._obj);var e = this;setTimeout(function () {
	        e._fireEvent("drawstop", e._obj.options);
	      }, 0);
	    }this._fireEvent("addtomap");
	  }, onRemove: function onRemove(t) {
	    "hideTooltip" in this && this.hideTooltip(), L.LayerGroup.prototype.onRemove.call(this, t), "Point" === this.options.type && t.removeLayer(this._obj), this._fireEvent("removefrommap");
	  }, remove: function remove(t) {
	    if (t) {
	      var e, i, n, o, s;for (e = 0, n = this.rings.length; n > e; e++) {
	        if (t.options.hole) {
	          for (i = 0, o = this.rings[e].holes.length; o > i; i++) {
	            if (s = this.rings[e].holes[i], t === s) {
	              this.rings[e].holes.splice(i, 1), s._map && s._map.removeLayer(s);break;
	            }
	          }if (!t._map) break;
	        } else if (t === this.rings[e].ring) {
	          for (i = 0, o = this.rings[e].holes.length; o > i; i++) {
	            s = this.rings[e].holes[i], s._map && s._map.removeLayer(s);
	          }this.rings.splice(e, 1), t._map && t._map.removeLayer(t);break;
	        }
	      }
	    } else this.rings = [];return this.rings.length < 1 && (this._originalStyle && this._obj.setStyle(this._originalStyle), this._parent.remove(this)), this;
	  }, _fireEvent: function _fireEvent(t) {
	    if (!("removefrommap" === t && this.rings.length > 1)) {
	      var e = { mode: this.mode || "", object: this };this.fire(t, e), this._parent.fire(t, e), "drawstop" === t && this._map && L.DomUtil.removeClass(this._map._mapPane, "leaflet-clickable");
	    }
	  }, getStyle: function getStyle() {
	    var t = L.extend({}, this._drawOptions);return delete t.holeStyle, "Point" === t.type && (L.extend(t, t.markerStyle.iconStyle), delete t.markerStyle), t;
	  }, setOptions: function setOptions(t) {
	    return t.lineStyle && this._setStyleOptions(t.lineStyle, "lines"), t.pointStyle && this._setStyleOptions(t.pointStyle, "points"), "editable" in t && (t.editable ? this.enableEdit() : this.disableEdit()), L.setOptions(this, t), this._fireEvent("optionschange"), this;
	  }, _setStyleOptions: function _setStyleOptions(t, e) {
	    for (var i = 0, n = this.rings.length; n > i; i++) {
	      var o = this.rings[i].ring[e];o.setStyle(t), o.redraw();for (var s = 0, l = this.rings[i].holes.length; l > s; s++) {
	        o = this.rings[i].holes[s][e], o.setStyle(t), o.redraw();
	      }
	    }this._fireEvent("stylechange");
	  }, _setLinesStyle: function _setLinesStyle(t) {
	    this._setStyleOptions(t, "lines");
	  }, _setPointsStyle: function _setPointsStyle(t) {
	    this._setStyleOptions(t, "points");
	  }, getOptions: function getOptions() {
	    var t = this.options,
	        e = L.extend({}, t);e.lineStyle = t.lineStyle, e.pointStyle = t.pointStyle;var i = L.GmxDrawing.utils.getNotDefaults(e, L.GmxDrawing.utils.defaultStyles);if (Object.keys(i.lineStyle).length || delete i.lineStyle, Object.keys(i.pointStyle).length || delete i.pointStyle, this._map || (i.map = !1), "Point" === t.type) {
	      var n = L.GmxDrawing.utils.getNotDefaults(this._obj.options, L.GmxDrawing.utils.defaultStyles.markerStyle.options);Object.keys(n).length && (i.options = n), n = L.GmxDrawing.utils.getNotDefaults(this._obj.options.icon.options, L.GmxDrawing.utils.defaultStyles.markerStyle.options.icon), Object.keys(n).length && (i.options.icon = n);
	    }return i;
	  }, _latLngsToCoords: function _latLngsToCoords(t, e) {
	    var i = L.GeoJSON.latLngsToCoords(t);if (e) {
	      var n = i[i.length - 1];(n[0] !== i[0][0] || n[1] !== i[0][1]) && i.push(i[0]);
	    }return i;
	  }, _latlngsAddShift: function _latlngsAddShift(t, e) {
	    for (var i = [], n = 0, o = t.length; o > n; n++) {
	      i.push(L.GmxDrawing.utils.getShiftLatlng(t[n], this._map, e));
	    }return i;
	  }, getPixelOffset: function getPixelOffset() {
	    var t = this.shiftPixel;if (!t && this._map) {
	      var e = 256 / L.gmxUtil.tileSizes[this._map._zoom];t = this.shiftPixel = new L.Point(Math.floor(e * this._dx), -Math.floor(e * this._dy));
	    }return t || new L.Point(0, 0);
	  }, setOffsetToGeometry: function setOffsetToGeometry(t, e) {
	    var i,
	        n,
	        o,
	        s,
	        l,
	        a,
	        r = 256 / L.gmxUtil.tileSizes[this._map._zoom],
	        h = new L.Point(r * (this._dx || t || 0), -r * (this._dy || e || 0));for (i = 0, n = this.rings.length; n > i; i++) {
	      var p = this.rings[i];if (l = p.ring, a = l.points.getLatLngs(), l.setLatLngs(this._latlngsAddShift(a, h)), p.holes && p.holes.length) for (o = 0, s = p.holes.length; s > o; o++) {
	        l = p.holes[o].ring, a = l.points.getLatLngs(), l.setLatLngs(this._latlngsAddShift(a, h));
	      }
	    }return this.setPositionOffset(), this;
	  }, setPositionOffset: function setPositionOffset(t, e) {
	    if (this._dx = t || 0, this._dy = e || 0, this._map) {
	      this.shiftPixel = null;for (var i = this.getPixelOffset(), n = 0, o = this.rings.length; o > n; n++) {
	        this.rings[n].ring.setPositionOffset(i);for (var s = 0, l = this.rings[n].holes.length; l > s; s++) {
	          this.rings[n].holes[s].setPositionOffset(i);
	        }
	      }
	    }
	  }, _getCoords: function _getCoords(t) {
	    for (var e = this.options.type, i = "Polygon" === e || "Rectangle" === e || "MultiPolygon" === e, n = t ? null : this.shiftPixel, o = [], s = 0, l = this.rings.length; l > s; s++) {
	      var a = this.rings[s],
	          r = this._latLngsToCoords(a.ring.points.getLatLngs(), i, n);if (i && (r = [r]), a.holes && a.holes.length) for (var h = 0, p = a.holes.length; p > h; h++) {
	        r.push(this._latLngsToCoords(a.holes[h].points.getLatLngs(), i, n));
	      }o.push(r);
	    }return ("Polyline" === e || i && "MultiPolygon" !== e) && (o = o[0]), o;
	  }, toGeoJSON: function toGeoJSON() {
	    return this._toGeoJSON(!0);
	  }, _toGeoJSON: function _toGeoJSON(t) {
	    var e,
	        i = this.options.type,
	        n = this.getOptions();if (delete n.mode, !this.options.editable || "Point" === i) {
	      var o = this._obj;o instanceof L.GeoJSON && (o = L.GmxDrawing.utils._getLastObject(o).getLayers()[0]);var s = o.toGeoJSON();return s.properties = n, s;
	    }return this.rings && (e = this._getCoords(t), "Rectangle" === i ? i = "Polygon" : "Polyline" === i ? i = "LineString" : "MultiPolyline" === i && (i = "MultiLineString")), L.GeoJSON.getFeature({ feature: { type: "Feature", properties: n } }, { type: i, coordinates: e });
	  }, getType: function getType() {
	    return this.options.type;
	  }, hideFill: function hideFill() {
	    this._fill._map && this._map.removeLayer(this._fill);
	  }, showFill: function showFill() {
	    var t = this.toGeoJSON(),
	        e = L.GeoJSON.geometryToLayer(t, null, null, { weight: 0 });return this._fill.clearLayers(), e instanceof L.LayerGroup ? e.eachLayer(function (t) {
	      this._fill.addLayer(t);
	    }, this) : (e.setStyle({ weight: 0, fill: !0, fillColor: "#0033ff" }), this._fill.addLayer(e)), this._fill._map || (this._map.addLayer(this._fill), this._fill.bringToBack()), this;
	  }, getBounds: function getBounds() {
	    var t = new L.LatLngBounds();if ("Point" === this.options.type) {
	      var e = this._obj.getLatLng();t.extend(e);
	    } else t = this._getBounds();return t;
	  }, _getBounds: function _getBounds(t) {
	    var e,
	        i = t || this,
	        n = new L.LatLngBounds();return i instanceof L.LayerGroup ? (i.eachLayer(function (t) {
	      e = this._getBounds(t), n.extend(e);
	    }, this), n) : (e = i instanceof L.Marker ? i.getLatLng() : i.getBounds(), n.extend(e), n);
	  }, initialize: function initialize(t, e, i) {
	    i = i || {}, i.mode = "", this._drawOptions = L.extend({}, i);var n = i.type;"Point" === n ? (delete i.pointStyle, delete i.lineStyle) : (delete i.iconUrl, delete i.iconAnchor, delete i.iconSize, delete i.popupAnchor, delete i.shadowSize, delete i.markerStyle), delete i.holeStyle, L.setOptions(this, i), this._layers = {}, this._obj = e, this._parent = t, this._dx = 0, this._dy = 0, this._initialize(t, e);
	  }, enableEdit: function enableEdit() {
	    this.options.mode = "edit";var t = this.options.type;if ("Point" !== t) {
	      for (var e = 0, i = this.rings.length; i > e; e++) {
	        var n = this.rings[e];n.ring.options.editable = this.options.editable, n.ring.setEditMode();for (var o = 0, s = n.holes.length; s > o; o++) {
	          var l = n.holes[o];l.options.editable = this.options.editable, l.setEditMode();
	        }
	      }var a = L.geoJson(this.toGeoJSON());this.options.editable = !0, this._initialize(this._parent, a);
	    }return this;
	  }, disableEdit: function disableEdit() {
	    var t = this.options.type;if ("Point" !== t) {
	      this._originalStyle = this.options.lineStyle;for (var e = L.geoJson(this.toGeoJSON().geometry, this._originalStyle).getLayers()[0], i = 0, n = this.rings.length; n > i; i++) {
	        var o = this.rings[i];o.ring.removeEditMode(), o.ring.options.editable = !1;for (var s = 0, l = o.holes.length; l > s; s++) {
	          var a = o.holes[s];a.removeEditMode(), a.options.editable = !1;
	        }
	      }this._obj = e, this.options.editable = !1, this._initialize(this._parent, this._obj);
	    }return this;
	  }, getArea: function getArea() {
	    var t = 0;return L.gmxUtil.geoJSONGetArea && (t = L.gmxUtil.geoJSONGetArea(this.toGeoJSON())), t;
	  }, getLength: function getLength() {
	    var t = 0;return L.gmxUtil.geoJSONGetLength && (t = L.gmxUtil.geoJSONGetLength(this.toGeoJSON())), t;
	  }, getSummary: function getSummary() {
	    var t = "",
	        e = this._map.options || {},
	        i = this.options.type;if ("Polyline" === i || "MultiPolyline" === i) t = L.gmxUtil.prettifyDistance(this.getLength(), e.distanceUnit);else if ("Polygon" === i || "MultiPolygon" === i || "Rectangle" === i) t = L.gmxUtil.prettifyArea(this.getArea(), e.squareUnit);else if ("Point" === i) {
	      var n = this._obj.getLatLng();t = L.gmxUtil.formatCoordinates(n);
	    }return t;
	  }, _initialize: function _initialize(t, e) {
	    if (this.clearLayers(), this.rings = [], this.mode = "", this._fill = L.featureGroup(), this.options.editable) {
	      for (var i = e.getLayers ? L.GmxDrawing.utils._getLastObject(e).getLayers() : [e], n = 0, o = i.length; o > n; n++) {
	        var s = i[n],
	            l = [],
	            a = new L.GmxDrawing.Ring(this, s._latlngs, { ring: !0, editable: this.options.editable });if (this.addLayer(a), s._holes) for (var r = 0, h = s._holes.length; h > r; r++) {
	          var p = new L.GmxDrawing.Ring(this, s._holes[r], { hole: !0, editable: this.options.editable });this.addLayer(p), l.push(p);
	        }this.rings.push({ ring: a, holes: l });
	      }if (L.gmxUtil && L.gmxUtil.prettifyDistance && !this._showTooltip) {
	        var g = function g(t) {
	          var e = L.gmxLocale ? L.gmxLocale.getText(t) : null;return e || t;
	        },
	            d = this;this._showTooltip = function (t, e) {
	          var i = e.ring,
	              n = e.originalEvent,
	              o = n.buttons || n.button;if (i && (i.downObject || !o)) {
	            var s = d._map.options || {},
	                l = s.distanceUnit,
	                a = s.squareUnit,
	                r = "";if ("Area" === t) {
	              if (!L.gmxUtil.getArea) return;r = e.originalEvent.ctrlKey ? g("Perimeter") + ": " + L.gmxUtil.prettifyDistance(d.getLength(), l) : g(t) + ": " + L.gmxUtil.prettifyArea(d.getArea(), a), d._parent.showTooltip(e.layerPoint, r);
	            } else if ("Length" === t) {
	              var h = L.GmxDrawing.utils.getDownType.call(d, e, d._map, d),
	                  p = i.getLength(h),
	                  c = ("edit" === h.mode || h.num > 1 ? h.type : "") + t,
	                  u = g(c);r = (u === c ? g(t) : u) + ": " + L.gmxUtil.prettifyDistance(p, l), d._parent.showTooltip(e.layerPoint, r);
	            }d._fireEvent("onMouseOver");
	          }
	        }, this.hideTooltip = function () {
	          this._parent.hideTooltip(), this._fireEvent("onMouseOut");
	        };
	      }
	    } else "Point" === this.options.type ? this._setMarker(e) : this.addLayer(e);
	  }, _enableDrag: function _enableDrag() {
	    this._parent._enableDrag();
	  }, _disableDrag: function _disableDrag() {
	    this._parent._disableDrag();
	  }, _setMarker: function _setMarker(t) {
	    var e = this,
	        i = this._parent;t.bindPopup(null, { maxWidth: 1e3, closeOnClick: i._map.options.maxPopupCount > 1 ? !1 : !0 }).on("dblclick", function () {
	      this._map.removeLayer(this), e.remove();
	    }).on("dragstart", function () {
	      e._fireEvent("dragstart");
	    }).on("drag", function () {
	      e._fireEvent("drag"), e._fireEvent("edit");
	    }).on("dragend", function () {
	      e._fireEvent("dragend");
	    }).on("popupopen", function (i) {
	      var n = i.popup;n._input || (n._input = L.DomUtil.create("textarea", "leaflet-gmx-popup-textarea", n._contentNode), n._input.value = e.options.title || t.options.title || "", n._contentNode.style.width = "auto"), L.DomEvent.on(n._input, "keyup", function () {
	        var i = this.value.split("\n"),
	            o = this.cols || 0;i.forEach(function (t) {
	          t.length > o && (o = t.length);
	        }), this.rows = i.length, o && (this.cols = o), n.update(), e.options.title = t.options.title = this.value, this.focus();
	      }, n._input), n.update();
	    }), i._map.addLayer(t), e.openPopup = t.openPopup = function () {
	      if (t._popup && t._map && !t._map.hasLayer(t._popup)) {
	        t._popup.setLatLng(t._latlng);var e = t._map.gmxDrawing;e._drawMode ? t._map.fire(e._createType ? "click" : "mouseup", { latlng: t._latlng, delta: 1 }) : (t._popup.addTo(t._map), t._popup._isOpen = !0);
	      }return t;
	    };
	  }, setAddMode: function setAddMode() {
	    return this.rings.length && this.rings[0].ring.setAddMode(), this;
	  }, _pointDown: function _pointDown(t) {
	    this.rings.length && this.rings[0].ring._pointDown(t);
	  }, getPopup: function getPopup() {
	    return "Point" === this.options.type ? this._obj.getPopup() : void 0;
	  } }), L.GmxDrawing.Ring = L.LayerGroup.extend({ options: { className: "leaflet-drawing-ring", opacity: 1, shape: "circle", fill: !0, fillColor: "#ffffff", fillOpacity: 1, size: L.Browser.mobile ? 40 : 8, weight: 2 }, includes: L.Mixin.Events, initialize: function initialize(t, e, i) {
	    i = i || {}, i.mode = "", this._activeZIndex = i.activeZIndex || 7, this._notActiveZIndex = i.notActiveZIndex || 6, this.options = L.extend({}, t.getStyle(), i), this._layers = {}, this._coords = e, this._legLength = [], this._parent = t, this._initialize(t, e);
	  }, _initialize: function _initialize(t, e) {
	    this.clearLayers(), delete this.lines, delete this.fill, delete this.points, this.downObject = !1, this.mode = "", this.lineType = -1 !== this.options.type.indexOf("Polyline");var i = this.options.pointStyle,
	        n = { opacity: 1, weight: 2, noClip: !0, clickable: !1, className: "leaflet-drawing-lines" };if (this.lineType || (n.fill = "fill" in this.options ? this.options.fill : !0), this.options.lineStyle) for (var o in this.options.lineStyle) {
	      "fill" === o && this.lineType || (n[o] = this.options.lineStyle[o]);
	    }this.options.hole && (n = L.extend({}, n, L.GmxDrawing.utils.defaultStyles.holeStyle), i = L.extend({}, i, L.GmxDrawing.utils.defaultStyles.holeStyle));var s = e,
	        l = this,
	        a = this.options.mode || (s.length ? "edit" : "add");this.lines = new L.Polyline(s, n), this.addLayer(this.lines), this.fill = new L.Polyline(s, { className: "leaflet-drawing-lines-fill", opacity: 0, fill: !1, size: 10, weight: 10 }), this.addLayer(this.fill), this.lineType || "edit" !== a || (this.lines.addLatLng(s[0]), this.fill.addLatLng(s[0])), this.mode = a, this.points = new L.GmxDrawing.PointMarkers(s, i), this.points._parent = this, this.addLayer(this.points), this.points.on("mouseover mousemove", function (t) {
	      t.ring = l, "_showTooltip" in this && this._showTooltip(l.lineType ? "Length" : "Area", t);
	    }, t).on("mouseout", function () {
	      "hideTooltip" in this && this.hideTooltip();
	    }, t), this.fill.on("mouseover mousemove", function (t) {
	      t.ring = l, "_showTooltip" in this && this._showTooltip("Length", t);
	    }, t).on("mouseout", function () {
	      "hideTooltip" in this && this.hideTooltip();
	    }, t);
	  }, onAdd: function onAdd(t) {
	    L.LayerGroup.prototype.onAdd.call(this, t), this.setEditMode();
	  }, onRemove: function onRemove(t) {
	    this.points && (this._pointUp(), this.removeAddMode(), this.removeEditMode(), "hideTooltip" in this._parent && this._parent.hideTooltip()), L.LayerGroup.prototype.onRemove.call(this, t), "Point" === this.options.type && t.removeLayer(this._obj), this._fireEvent("removefrommap");
	  }, getLength: function getLength(t) {
	    var e = 0,
	        i = this.points._latlngs,
	        n = i.length;if (n) {
	      var o = 1,
	          s = i[0];t && ("node" === t.type ? n = t.num + 1 : (o = t.num, o === n ? (s = i[o - 1], o = 0) : s = i[o - 1], n = o + 1));for (var l = o; n > l; l++) {
	        var a = this._legLength[l] || null;null === a && (a = L.gmxUtil.distVincenty(s.lng, s.lat, i[l].lng, i[l].lat), this._legLength[l] = a), s = i[l], e += a;
	      }
	    }return e;
	  }, _setPoint: function _setPoint(t, e, i) {
	    if (this.points) {
	      var n = this.points._latlngs;"Rectangle" === this.options.type ? ("edge" === i ? (e--, 0 === e ? n[0].lng = n[1].lng = t.lng : 1 === e ? n[1].lat = n[2].lat = t.lat : 2 === e ? n[2].lng = n[3].lng = t.lng : 3 === e && (n[0].lat = n[3].lat = t.lat)) : (n[e] = t, 0 === e ? (n[3].lat = t.lat, n[1].lng = t.lng) : 1 === e ? (n[2].lat = t.lat, n[0].lng = t.lng) : 2 === e ? (n[1].lat = t.lat, n[3].lng = t.lng) : 3 === e && (n[0].lat = t.lat, n[2].lng = t.lng)), this._legLength = []) : (n[e] = t, this._legLength[e] = null, this._legLength[e + 1] = null), this.setLatLngs(n);
	    }
	  }, addLatLng: function addLatLng(t, e) {
	    if (this._legLength = [], this.points) {
	      var i = this.points._latlngs,
	          n = i.length,
	          o = i[n - 2];o && o.equals(t) || (e && (n -= e), this._setPoint(t, n, "node"));
	    } else "addLatLng" in this._obj && this._obj.addLatLng(t);
	  }, setPositionOffset: function setPositionOffset(t) {
	    L.DomUtil.setPosition(this.points._container, t), L.DomUtil.setPosition(this.fill._container, t), L.DomUtil.setPosition(this.lines._container, t);
	  }, setLatLngs: function setLatLngs(t) {
	    if (this.points) {
	      var e = this.points;this.fill.setLatLngs(t), this.lines.setLatLngs(t), !this.lineType && "edit" === this.mode && t.length > 2 && (this.lines.addLatLng(t[0]), this.fill.addLatLng(t[0])), e.setLatLngs(t);
	    } else "setLatLngs" in this._obj && this._obj.setLatLngs(t);this._fireEvent("edit");
	  }, _pointDown: function _pointDown(t) {
	    if ((L.Browser.ie || L.gmxUtil && L.gmxUtil.gtIE11) && this._map.dragging._draggable._onUp(), this._parent._disableDrag(), t.originalEvent) {
	      var e = t.originalEvent;if (e.ctrlKey) return this._onDragStart(t), void 0;if (1 !== e.which && 1 !== e.button) return;
	    }var i = L.GmxDrawing.utils.getDownType.call(this, t, this._map, this._parent),
	        n = i.type,
	        o = this.options;if (this._lastDownTime = Date.now() + 100, this.down = i, "edge" === n && "Rectangle" !== o.type) {
	      if (o.disableAddPoints) return;this._legLength = [];var s = i.num,
	          l = this.points._latlngs;l.splice(s, 0, l[s]), this._setPoint(t.latlng, s, n);
	    }this.downObject = !0, this._map.on("mousemove", this._pointMove, this).on("mouseup", this._pointUp, this);
	  }, _pointMove: function _pointMove(t) {
	    this.down && this._lastDownTime < Date.now() && (this.lineType || this._parent.showFill(), this._clearLineAddPoint(), this._moved = !0, this._setPoint(t.latlng, this.down.num, this.down.type), "_showTooltip" in this._parent && this._parent._showTooltip(this.lineType ? "Length" : "Area", t));
	  }, _pointUp: function _pointUp(t) {
	    if (this.downObject = !1, this._parent._enableDrag(), this.points) {
	      if (this._map) {
	        this._map.off("mousemove", this._pointMove, this).off("mouseup", this._pointUp, this);var e = t && t.originalEvent ? t.originalEvent.target : null;if (e && e._leaflet_pos && /leaflet-marker-icon/.test(e.className)) {
	          var i = L.GmxDrawing.utils.getMarkerByPos(e._leaflet_pos, this._map.gmxDrawing.getFeatures());this._setPoint(i, this.down.num, this.down.type);
	        }this._map._skipClick = !0;
	      }this._drawstop && this._fireEvent("drawstop"), this._drawstop = !1, this.down = null;var n = this.options.lineStyle || {};n.fill || this.lineType || this._parent.hideFill();
	    }
	  }, _lastPointClickTime: 0, _removePoint: function _removePoint(t) {
	    var e = this.points._latlngs;e.length > t && (this._legLength = [], e.splice(t, 1), "Rectangle" === this.options.type || e.length < 2 || e.length < 3 && !this.lineType ? this._parent.remove(this) : this._setPoint(e[0], 0));
	  }, _clearLineAddPoint: function _clearLineAddPoint() {
	    this._lineAddPointID && clearTimeout(this._lineAddPointID), this._lineAddPointID = null;
	  }, _pointDblClick: function _pointDblClick(t) {
	    if (this._clearLineAddPoint(), !this._lastAddTime || Date.now() > this._lastAddTime) {
	      var e = L.GmxDrawing.utils.getDownType.call(this, t, this._map, this._parent);this._removePoint(e.num);
	    }
	  }, _pointClick: function _pointClick(t) {
	    if (!t.originalEvent || !t.originalEvent.ctrlKey) {
	      var e = Date.now(),
	          i = this._lastPointClickTime;if (this._lastPointClickTime = e + 300, this._moved || i > e) return this._moved = !1, void 0;var n = L.GmxDrawing.utils.getDownType.call(this, t, this._map, this._parent),
	          o = this.mode;if ("node" === n.type) {
	        var s = n.num;if (n.end) {
	          if ("add" === o) this._pointUp(), this.setEditMode(), this.lineType && 0 === s && (this._parent.options.type = this.options.type = "Polygon", this.lineType = !1, this._removePoint(this.points._latlngs.length - 1)), this._fireEvent("drawstop"), this._removePoint(s);else if (this.lineType) {
	            var l = this,
	                a = function a() {
	              l._clearLineAddPoint(), 0 === s && l.points._latlngs.reverse(), l.points.addLatLng(n.latlng), l.setAddMode(), l._fireEvent("drawstop");
	            };this._lineAddPointID = setTimeout(a, 250);
	          }
	        } else "add" === o && this.addLatLng(t.latlng);
	      }
	    }
	  }, _onDragEnd: function _onDragEnd() {
	    this._map.off("mouseup", this._onDragEnd, this).off("mousemove", this._onDrag, this), this._parent._enableDrag(), this._fireEvent("dragend");
	  }, _onDragStart: function _onDragStart(t) {
	    this._dragstartPoint = t.latlng, this._map.on("mouseup", this._onDragEnd, this).on("mousemove", this._onDrag, this), this._fireEvent("dragstart");
	  }, _onDrag: function _onDrag(t) {
	    var e = this._dragstartPoint.lat - t.latlng.lat,
	        i = this._dragstartPoint.lng - t.latlng.lng,
	        n = this.points._latlngs;n.forEach(function (t) {
	      t.lat -= e, t.lng -= i;
	    }), this._dragstartPoint = t.latlng, this._legLength = [], this.setLatLngs(n), this._fireEvent("drag");
	  }, _fireEvent: function _fireEvent(t) {
	    this._parent._fireEvent(t);
	  }, _startTouchMove: function _startTouchMove(t, e) {
	    var i = L.GmxDrawing.utils.getDownType.call(this, t, this._map, this._parent);if ("node" === i.type) {
	      this._parent._disableDrag(), this.down = i;var n = this,
	          o = function o(t) {
	        i = L.GmxDrawing.utils.getDownType.call(n, t, n._map, this._parent), 1 === t.touches.length && n._pointMove(i);
	      },
	          s = function s() {
	        L.DomEvent.off(n._map._container, "touchmove", o, n).off(n._map._container, "touchend", s, n), n._parent._enableDrag(), e && n._parent.fire("drawstop", { mode: n.options.type, object: n });
	      };L.DomEvent.on(n._map._container, "touchmove", o, n).on(n._map._container, "touchend", s, n);
	    }
	  }, _editHandlers: function _editHandlers(t) {
	    var e = L.DomEvent.stopPropagation;if (this.touchstart && L.DomEvent.off(this.points._container, "touchstart", this.touchstart, this), this.touchstartFill && L.DomEvent.off(this.fill._container, "touchstart", this.touchstartFill, this), this.touchstart = null, this.touchstartFill = null, t) {
	      if (this.points.on("dblclick click", e, this).on("dblclick", this._pointDblClick, this).on("click", this._pointClick, this), L.Browser.mobile) {
	        this._EditOpacity && this._parent._setPointsStyle({ fillOpacity: this._EditOpacity });var i = this;this.touchstart = function (t) {
	          i._startTouchMove(t);
	        }, L.DomEvent.on(this.points._container, "touchstart", this.touchstart, this), this.touchstartFill = function (t) {
	          var e = L.GmxDrawing.utils.getDownType.call(i, t, i._map, this._parent);if ("edge" === e.type && "Rectangle" !== i.options.type) {
	            var n = i.points._latlngs;n.splice(e.num, 0, n[e.num]), i._legLength = [], i._setPoint(e.latlng, e.num, e.type);
	          }
	        }, L.DomEvent.on(this.fill._container, "touchstart", this.touchstartFill, this);
	      } else this.points.on("mousemove", e).on("mousedown", this._pointDown, this), this.fill.on("dblclick click", e, this).on("mousedown", this._pointDown, this), this._fireEvent("editmode");
	    } else this._pointUp(), this.points.off("dblclick click", e, this).off("dblclick", this._pointDblClick, this).off("click", this._pointClick, this), L.Browser.mobile || (this.points.off("mousemove", e).off("mousedown", this._pointDown, this), this.fill.off("dblclick click", e, this).off("mousedown", this._pointDown, this));
	  }, _createHandlers: function _createHandlers(t) {
	    if (this.points) {
	      var e = L.DomEvent.stopPropagation;if (t) this._parent._enableDrag(), this._map.on("dblclick", e).on("mousedown", this._mouseDown, this).on("mouseup", this._mouseUp, this).on("mousemove", this._moseMove, this), this.points.on("click", this._pointClick, this), this._fireEvent("addmode"), this.lineType || this.lines.setStyle({ fill: !0 });else {
	        this._map && (this._map.off("dblclick", e).off("mouseup", this._mouseUp, this).off("mousemove", this._moseMove, this), this.points.off("click", this._pointClick, this));var i = this.options.lineStyle || {};this.lineType || i.fill || this.lines.setStyle({ fill: !1 });
	      }
	    }
	  }, setEditMode: function setEditMode() {
	    return this.options.editable && (this._editHandlers(!1), this._createHandlers(!1), this._editHandlers(!0), this.mode = "edit"), this;
	  }, setAddMode: function setAddMode() {
	    return this.options.editable && (this._editHandlers(!1), this._createHandlers(!1), this._createHandlers(!0), this.mode = "add"), this;
	  }, removeAddMode: function removeAddMode() {
	    this._createHandlers(!1), this.mode = "";
	  }, removeEditMode: function removeEditMode() {
	    this._editHandlers(!1), this.mode = "";
	  }, _moseMove: function _moseMove(t) {
	    if (this.points) {
	      var e = this.points._latlngs;1 === e.length && this._setPoint(t.latlng, 1), this._setPoint(t.latlng, e.length - 1);
	    }
	  }, _mouseDown: function _mouseDown() {
	    this._lastMouseDownTime = Date.now() + 200;
	  }, _mouseUp: function _mouseUp(t) {
	    var e = Date.now();if (t.delta || e < this._lastMouseDownTime) {
	      this._lastAddTime = e + 1e3;var i = t._latlng || t.latlng;t.delta && this.addLatLng(i, t.delta), this.addLatLng(i), this._parent._parent._clearCreate();
	    }
	  } }), L.GmxDrawing.PointMarkers = L.Polygon.extend({ options: { className: "leaflet-drawing-points", smoothFactor: 0, opacity: 1, shape: "circle", fill: !0, fillColor: "#ffffff", fillOpacity: 1, size: L.Browser.mobile ? 40 : 8, weight: 2 }, getPathLatLngs: function getPathLatLngs() {
	    for (var t, e, i = [], n = this.options.size, o = this._parts[0], s = 0, l = o.length; l > s; s++) {
	      e = o[s], (0 === s || Math.abs(t.x - e.x) > n || Math.abs(t.y - e.y) > n) && (i.push(this._latlngs[s]), t = e);
	    }return i;
	  }, _getPathPartStr: function _getPathPartStr(t) {
	    for (var e, i, n = L.Path.VML, o = this.options.size / 2, s = "add" !== this._parent.mode || L.Browser.mobile ? 0 : 1, l = "circle" === this.options.shape ? !0 : !1, a = 0, r = t.length - s, h = ""; r > a; a++) {
	      if (i = t[a], n && i._round(), 0 === a || Math.abs(e.x - i.x) > this.options.size || Math.abs(e.y - i.y) > this.options.size) {
	        if (l) h += "M" + i.x + "," + (i.y - o) + " A" + o + "," + o + ",0,1,1," + (i.x - .1) + "," + (i.y - o) + " ";else {
	          var p = i.x,
	              g = p - o,
	              d = p + o,
	              c = i.y,
	              u = c - o,
	              f = c + o;h += "M" + g + " " + u + "L" + d + " " + u + "L" + d + " " + f + "L" + g + " " + f + "L" + g + " " + u;
	        }e = i;
	      }
	    }return h;
	  }, _onMouseClick: function _onMouseClick(t) {
	    this._fireMouseEvent(t);
	  }, _isPathChange: function _isPathChange() {
	    this.projectLatlngs();var t = this.getPathString();return t !== this._pathStr ? (this._pathStr = t, !0) : !1;
	  }, _updatePath: function _updatePath() {
	    this._map && (this._clipPoints(), this._isPathChange() && ("inherit" !== this._path.getAttribute("fill-rule") && this._path.setAttribute("fill-rule", "inherit"), this._path.setAttribute("d", this._pathStr || "M0 0")));
	  } }), L.GmxDrawing.utils = { defaultStyles: { mode: "", map: !0, editable: !0, holeStyle: { opacity: .5, color: "#003311" }, lineStyle: { opacity: 1, weight: 2, noClip: !0, clickable: !1, className: "leaflet-drawing-lines", color: "#0033ff", dashArray: null, lineCap: null, lineJoin: null, fill: !1, fillColor: null, fillOpacity: .2, smoothFactor: 1, stroke: !0 }, pointStyle: { className: "leaflet-drawing-points", noClip: !0, smoothFactor: 0, opacity: 1, shape: "circle", fill: !0, fillColor: "#ffffff", fillOpacity: 1, size: L.Browser.mobile ? 40 : 8, weight: 2, clickable: !0, color: "#0033ff", dashArray: null, lineCap: null, lineJoin: null, stroke: !0 }, markerStyle: { mode: "", editable: !1, title: "Text example", options: { alt: "", clickable: !0, draggable: !1, keyboard: !0, opacity: 1, zIndexOffset: 0, riseOffset: 250, riseOnHover: !1, icon: { className: "", iconUrl: "", iconAnchor: [12, 41], iconSize: [25, 41], popupAnchor: [1, -34], shadowSize: [41, 41] } } } }, getNotDefaults: function getNotDefaults(t, e) {
	    var i = {};
	    for (var n in t) {
	      if ("icon" !== n && "map" !== n) if ("iconAnchor" === n || "iconSize" === n || "popupAnchor" === n || "shadowSize" === n) {
	        if (!e[n]) continue;(e[n][0] !== t[n][0] || e[n][1] !== t[n][1]) && (i[n] = t[n]);
	      } else "lineStyle" === n || "pointStyle" === n || "markerStyle" === n ? i[n] = this.getNotDefaults(t[n], e[n]) : e && e[n] === t[n] && "fill" !== n || (i[n] = t[n]);
	    }return i;
	  }, getShiftLatlng: function getShiftLatlng(t, e, i) {
	    if (i && e) {
	      var n = e.latLngToLayerPoint(t)._add(i);t = e.layerPointToLatLng(n);
	    }return t;
	  }, getDownType: function getDownType(t, e, i) {
	    var n = t.layerPoint,
	        o = !1,
	        s = t.latlng;if (t.originalEvent && t.originalEvent.ctrlKey && (o = !0), t.touches && 1 === t.touches.length) {
	      var l = t.touches[0],
	          a = e.mouseEventToContainerPoint(l);n = e.containerPointToLayerPoint(a), s = e.layerPointToLatLng(n);
	    }var r = { type: "", latlng: s, ctrlKey: o },
	        h = this.points ? this : t.ring,
	        p = h.points._originalPoints || [],
	        g = p.length;if (0 === g) return r;var d = (h.points.options.size || 10) / 2;d += 1 + (h.points.options.weight || 2);var c = new L.Bounds(L.point(n.x - d, n.y - d), L.point(n.x + d, n.y + d)),
	        u = p[g - 1],
	        f = g - ("add" === h.mode ? 2 : 1);r = { mode: h.mode, layerPoint: t.layerPoint, ctrlKey: o, latlng: s };for (var _ = 0; g > _; _++) {
	      var m = p[_];if (i.shiftPixel && (m = p[_].add(i.shiftPixel)), c.contains(m)) {
	        r.type = "node", r.num = _, r.end = 0 === _ || _ === f ? !0 : !1;break;
	      }var y = L.LineUtil.pointToSegmentDistance(n, u, m);d > y && (r.type = "edge", r.num = 0 === _ ? g : _), u = m;
	    }return r;
	  }, _getLastObject: function _getLastObject(t) {
	    if (t.getLayers) {
	      var e = t.getLayers().shift();return e.getLayers ? this._getLastObject(e) : t;
	    }return t;
	  }, getMarkerByPos: function getMarkerByPos(t, e) {
	    for (var i = 0, n = e.length; n > i; i++) {
	      var o = e[i],
	          s = o._obj ? o._obj : null,
	          l = s && s._icon ? s._icon._leaflet_pos : null;if (l && l.x === t.x && l.y === t.y) return s._latlng;
	    }return null;
	  } };

/***/ },
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */
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
	            onFetch = _ref.onFetch;
	
	        _classCallCheck(this, OsmDataProvider);
	
	        this._serverBase = serverBase;
	        this._onFetch = onFetch;
	        this.showSuggestion = true;
	        this.showOnMap = false;
	        this.showOnSelect = true;
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
	                }).then(function (text) {
	                    var json = JSON.parse(text.slice(1, text.length - 1));
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
	                }).then(function (text) {
	                    var json = JSON.parse(text.slice(1, text.length - 1));
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
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CoordinatesDataProvider = function () {
	    function CoordinatesDataProvider(_ref) {
	        var onFetch = _ref.onFetch;
	
	        _classCallCheck(this, CoordinatesDataProvider);
	
	        this._onFetch = onFetch;
	        this.showSuggestion = false;
	        this.showOnMap = true;
	        this.showOnSelect = false;
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
	            var _this2 = this;
	
	            var g = this._parseCoordinates(value);
	            return new Promise(function (resolve) {
	                var result = { feature: { type: 'Feature', geometry: g, properties: {} }, provider: _this2, query: value };
	                if (typeof _this2._onFetch === 'function') {
	                    _this2._onFetch(result);
	                }
	                resolve(g ? [result] : []);
	            });
	        }
	    }, {
	        key: 'find',
	        value: function find(value, limit, strong, retrieveGeometry) {
	            return new Promise(function (resolve) {
	                return resolve([]);
	            });
	        }
	    }]);
	
	    return CoordinatesDataProvider;
	}();
	
	window.nsGmx = window.nsGmx || {};
	window.nsGmx.CoordinatesDataProvider = CoordinatesDataProvider;
	
	exports.CoordinatesDataProvider = CoordinatesDataProvider;

/***/ },
/* 12 */
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
	            onFetch = _ref.onFetch;
	
	        _classCallCheck(this, CadastreDataProvider);
	
	        this._serverBase = serverBase;
	        this._tolerance = tolerance;
	        this._onFetch = onFetch;
	        this.showSuggestion = true;
	        this.showOnMap = false;
	        this.showOnSelect = false;
	        this._cadastreLayers = [{ id: 5, title: 'ОКС', reg: /^\d\d:\d+:\d+:\d+:\d+$/ }, { id: 1, title: 'Участок', reg: /^\d\d:\d+:\d+:\d+$/ }, { id: 2, title: 'Квартал', reg: /^\d\d:\d+:\d+$/ }, { id: 3, title: 'Район', reg: /^\d\d:\d+$/ }, { id: 4, title: 'Округ', reg: /^\d\d$/ }, { id: 10, title: 'ЗОУИТ', reg: /^\d+\.\d+\.\d+/ }
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
	            return null;
	        }
	    }, {
	        key: 'find',
	        value: function find(value, limit, strong, retrieveGeometry) {
	            var _this = this;
	
	            return new Promise(function (resolve) {
	                var req = new Request(_this._serverBase + '/typeahead?limit=' + limit + '&skip=0&text=' + value);
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