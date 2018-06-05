### Плагин контрола поиска nsGmx.SearchControl
Позволяет производить поиск объектов. Расширяет [L.Control](http://leafletjs.com/reference.html#control).

#### Creation

| Factory | Описание |
|---------|:---------|
| L.control.gmxSearch (`<Options>` options?) | Создание контрола поиска. |

#### Options

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|:------------:|:---------|
| id | `<String>` | search | Идентификатор контрола. |
|position | `<String>` | `topright` | По умолчанию в правом верхнем углу карты. |
| placeHolder | `<String>` | `Поиск по кадастру, адресам, координатам` | Подсказка поля ввода поисковой строки. |
| limit | `<Number>` | 10 | Ограничение количества найденных объектов. |
| providers | `<Provider[]>` | [] | По умолчанию включаются встроенные провайдеры ([CoordinatesDataProvider](#CoordinatesDataProvider), [OsmDataProvider](#OsmDataProvider), [CadastreDataProvider](#CadastreDataProvider)). |

#### Методы

#### setText

`Leaflet.ExtSearch.SearchControl.setText (value)` - заменяет  содержимое строки поиска

| Параметр | Возвращает | Тип данных | Описание |  
|----------|------------|:-----------|----------|
| Value | this | String | Установка значения поля ввода поисковой строки.|

#### Events

`Leaflet.ExtSearch.SearchWidget`

`suggestions:confirm` - срабатывает при нажатии пользователем "Enter" в строке поиска.

| Type | Property | Description |
| ---- | -------- |:------------|
| detail | `<Event>` | Текущий текст в строке поиска. |

### Provider

`Leaflet.ExtSearch.OsmDataProvider` - объект поискового провайдера OSM.

Должен обладать следующими свойствами.
#### Options

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|:------------:|:-----------
| id| `<String>` | search | Идентификатор контрола. |
| showSuggestion | `<Bool>` | false | Показывать список подсказок |
| showOnSelect | `<Bool>` | false | Показывать объект при выделении в списке |

#### Events

`fetch {detail} detail` - массив найденных объектов типа detail

| Type | Property | Description |
| ---- | -------- |:-----------|
| feature | `<Event>` |Метаданные найденного объекта в формате GeoJSON. |
| provider | `<Event>` | Ссылка на провайдер `(Leaflet.ExtSearch.OsmDataProvide)` |
| query | `<Event>` | Поисковый объект |


#### Методы

#### Find
`Leaflet.ExtSearch.Provider.find(value, limit, strong, retrieveGeometry)` - выполняет поиск введённых в строку объектов.

| Параметр | Возвращает | Тип данных | Описание | Значение по умолчанию |
|----------|------------|------------|:---------|-----------------------|
| value | `this` | String | Поисковая строка | - |
| limit | `this` | Int | Количество элементов, возвращаемых провайдером при поиске | 10 |
| strong | `this` | Bool | Строгий поиск объектов | false |
| retrieveGeometry | `this` | Bool | Возвращает геометрию объектов | false |

#### Fetch
`Leaflet.ExtSearch.Provider.fetch (obj)` - возвращает искомый объект со всеми метаданными.

| Параметр | Возвращает | Тип данных | Описание | Значение по умолчанию |
|----------|------------|------------|:---------|-----------------------|
| obj | `this` | Object | Объект поиска. | Null |


### CoordinatesDataProvider

Провайдер координатного поиска.

| Параметр | Тип | Описание |
|--------|:---:|:-----------|
| id | `<UInt>` | Идентификатор объекта. |
| properties | `<attribute[]>` | Массив атрибутов (первый элемент - id объекта, последний - геометрия части объекта). |
| dataOption | `<Object>` | Дополнительная информация. |
| item | `<Object>` | Дополнительная информация объекта. |
