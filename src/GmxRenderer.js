import '../external/gmxDrawing/dist/gmxDrawing-min.js';
import '../external/gmxDrawing/dist/css/gmxDrawing.css';

class GmxRenderer {
    constructor(map){
        this._map = map;
        this._gmxDrawing = new L.GmxDrawing ();
        this._gmxDrawing.initialize(map);        
    }
    render(features, style){
        if(features && features.length){
            let json = features
            .reduce ((a, geojson) => {                
                L.geoJson (geojson, {
                    style: function (feature) {
                        return style.lineStyle;
                    },
                    onEachFeature: function (feature, layer) {
                        this._gmxDrawing.add(layer, style);
                    }.bind(this)
                });
                a.addData(geojson.geometry);
                return a;
            }, L.geoJson());
            let bounds = json.getBounds();
            this._map.fitBounds(bounds);
            this._map.invalidateSize();
        }
    }
}

export { GmxRenderer };