(function(){    

    let map = L.map('map', {
        center: new L.LatLng(55.634508, 37.433167),
        minZoom: 3,
        maxZoom: 17,
        zoom: 3,
        boxZoom: false,
        attributionControl: false,
        zoomControl: false,
        squareUnit: 'km2',
        distanceUnit: 'km'
    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let searchControl = new nsGmx.SearchControl(   
    {
        position:'topleft',
        providers: [
            new nsGmx.OsmDataProvider({
                serverBase: 'http://maps.kosmosnimki.ru',
                limit: 10,
            }),
        ]
    });

    map.addControl(searchControl);
}());