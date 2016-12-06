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

	let cnInterface = window.nsGmx ? window.nsGmx.cadastre : null,
		cadastreLayerGroup = cnInterface ? cnInterface.afterViewer({notHideDrawing:true}, map) : null;

    let searchControl = new nsGmx.SearchControl(   
    {
        placeHolder: 'Поиск по кадастру, адресам, координатам',
        showFirst: true,
        position:'topright',
        limit: 10,
        providers: [
            new nsGmx.CoordinatesDataProvider({
                showOnMap: false,
                onFetch: function (response) {

                },
            }),                   
            new nsGmx.OsmDataProvider({
                showOnMap: true,
                serverBase: 'http://maps.kosmosnimki.ru',
                limit: 10,
                onFetch: function (response) {
                    console.log(response);
                },
            }),
            new nsGmx.CadastreDataProvider({
                serverBase: 'http://pkk5.rosreestr.ru/api',
                limit: 10,
                tolerance: 2048,
                onFetch: function (response) {
                    // console.log(response);
					if (cadastreLayerGroup && response && response.features) {
						if (!map.hasLayer(cadastreLayerGroup)) {
							cadastreLayerGroup.addTo(map);
						}
						var cn = response.features[0].attrs.cn;
						cnInterface.searchHook(cn);
					}
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
                weight: 3,
                opacity: 1,
                color: '#008B8B'
            }
        },
    });

    map.addControl(searchControl);
}());