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
        showFirst: true,
        position:'topleft',
        providers: [
            new nsGmx.CoordinatesDataProvider({
                onFetch: function (response) {

                },
            }),            
            new nsGmx.OsmDataProvider({
                serverBase: 'http://maps.kosmosnimki.ru',
                limit: 10,
                onFetch: function (response) {

                },
            }),
            new nsGmx.CadastreDataProvider({
                serverBase: 'http://pkk5.rosreestr.ru/api',
                limit: 10,
                tolerance: 2048,
                onFetch: function (response) {

                },
            }),            
        ],
        style: {
            editable: false,
            map: true,
            pointStyle: {
                size: 8,
                weight: 1,
                opacity: 1,
                color: '#00008B'
            },
            lineStyle: {
                fill: false,
                weight: 2,
                opacity: 1,
                color: '#00008B'
            }
        },
    });

    map.addControl(searchControl);
}());