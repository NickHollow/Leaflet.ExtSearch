import '../external/gmxDrawing/dist/gmxDrawing-min.js';
import '../external/gmxDrawing/dist/css/gmxDrawing.css';

class GmxRenderer {
    constructor(map){
        this._map = map;
        this._gmxDrawing = new L.GmxDrawing ();
        this._gmxDrawing.initialize(map);        
    }
    render(feature, options){
        let layer = L.GeoJSON.geometryToLayer(feature.geometry);        
        this._gmxDrawing.add(layer, options).addTo(this._map);
        if(feature.geometry.type === 'Point'){
            let coords = feature.geometry.coordinates;
            this._map.setView(L.latLng(coords[1], coords[0]), 14);            
        }
        else {
            let bounds = layer.getBounds();
            this._map.fitBounds(bounds);
        }
        
        this._map.invalidateSize();
    }
}

export { GmxRenderer };