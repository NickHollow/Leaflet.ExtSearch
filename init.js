import { SearchWidget } from './src/SearchWidget.js';
import { SearchControl } from './src/SearchControl.js';
import { OsmDataProvider } from './src/DataProviders/OsmDataProvider.js';
import { CoordinatesDataProvider } from './src/DataProviders/CoordinatesDataProvider.js';
import { CadastreDataProvider } from './src/DataProviders/CadastreDataProvider.js';

window.nsGmx = window.nsGmx || {};
window.nsGmx.SearchWidget = SearchWidget;
window.nsGmx.SearchControl = SearchControl;
window.nsGmx.OsmDataProvider = OsmDataProvider;
window.nsGmx.CoordinatesDataProvider = CoordinatesDataProvider;
window.nsGmx.CadastreDataProvider = CadastreDataProvider;