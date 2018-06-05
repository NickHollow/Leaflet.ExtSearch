# Leaflet.ExtSearch

[Documentation](documentation.md) is available in separate file ([Russian version](documentation-rus.md)).

## Leaflet Extended Search Control
### Usage:
```javascript
var searchControl = new nsGmx.SearchControl({
        placeHolder: 'Поиск по кадастру, адресам, координатам',        
        position: 'topleft',
        limit: 10,
        providers: [            
            new nsGmx.OsmDataProvider({                
                serverBase: 'http://maps.kosmosnimki.ru',
                limit: 10,
                onFetch: function (results) {                    
                }.bind(this),
            })
        ],
    });
map.addControl(searchControl);
```
- `<String> placeHolder` - default input text
- `<String> position` - leaflet control corner
- `<Int> limit` - suggestion rows limit
- `<Object>[] providers` - suggestion providers
