### Плагин контрола поиска nsGmx.SearchControl
Позволяет производить поиск объектов. Расширяет [L.Control](http://leafletjs.com/reference.html#control).

#### Создание

| Создание | Описание |
|---------|:---------|
| nsGmx.SearchControl (`<Options>` options?) | Создание контрола поиска |

#### Oпции

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|:------------:|:---------|
| id | String | search | Идентификатор контрола. |
|position | String | `topright` | Положение контрола в одном из углов карты (`topleft`, `topright`, `bottomleft` или `bottomright`) |
| placeHolder | String | Поиск по кадастру, адресам, координатам | Подсказка поля ввода поисковой строки. |
| limit | Int | 10 | Ограничение количества выводимых объектов. |
| providers | Интерфейс | [] | Принудительно включаются встроенные провайдеры ([CoordinatesDataProvider](#CoordinatesDataProvider), [OsmDataProvider](#OsmDataProvider), [CadastreDataProvider](#CadastreDataProvider)). |

#### Методы

#### setText

`nsGmx.SearchControl.setText (value)` - заменяет  содержимое строки поиска.

| Параметр | Возвращает | Тип данных | Описание |  
|----------|:----------:|:-----------|----------|
| Value | [] | String | Установка значения поля ввода поисковой строки.|

#### События

`nsGmx.SearchControl.SearchWidget`

| Имя | Тип | Описание |
| --- | -------- |:---------|
| `suggestions:confirm` | Event | Срабатывает при нажатии пользователем "Enter" в строке поиска. |

#### Event

| Параметр | Описание |
| -------- |:---------|
| `detail` | Текущий текст в строке поиска |

`new.nsGmx.SearchControl.SearchWidget(container, <Options> options)`


#### Опции

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|:-------------|:---------|
| placeHolder | String | Поиск по кадастру, адресам, координатам | Подсказка поля ввода поисковой строки. |
| provider | Интерфейс | [] | Принудительно включаются встроенные провайдеры ([CoordinatesDataProvider](#CoordinatesDataProvider), [OsmDataProvider](#OsmDataProvider), [CadastreDataProvider](#CadastreDataProvider)). |
| suggestionTimeout | Int | 1000 | Задержка вывода списка при вводе поисковой строки в миллисекундах |
| fuzzySearchLimit | Int | 1000 | Ограничение количества возвращаемых результатов при нечетком поиске |
| retrieveManyOnEnter | Bool | false | Считать нажатие "Enter" командой поиска |
| replaceInputOnEnter  | Bool | false | Заменять содержимое строки поиска описанием найденного объекта |


### Провайдеры

Возможно подключение следующих провайдеров: [CoordinatesDataProvider](#CoordinatesDataProvider), [OsmDataProvider](#OsmDataProvider), [CadastreDataProvider](#CadastreDataProvider)



#### CoordinatesDataProvider


`new nsGmx.CoordinatesDataProvider ()` - задание провайдера поиска по координатам.

#### OsmDataProvider

`nsGmx.SearchControl.OsmDataProvider ()` - объект поискового провайдера OSM.

#### Опции поискового провайдера OSM

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|:------------:|:-----------
| id| String | search | Идентификатор контрола. |
| showSuggestion | Bool | false | Показывать список подсказок |
| showOnSelect | Bool | false | Показывать объект при выделении в списке |

#### События поискового провайдера OSM


| Имя | Тип | Описание |
| --- | --- |:---------|
| fetch  | Event | Сообщение провайдером результата поискового запроса пользователя |

### Event

| Свойство | Описание |
| --- | -------- |
| detail  | Массив найденных провайдером  объектов  |

| Параметр | Описание |
| --- | --- |:---------|
| feature |  Метаданные найденного объекта в формате GeoJSON |
| provider | Ссылка на провайдер `(nsGmx.SearchControl.OsmDataProvide)` |
| query | Поисковый объект |


#### Методы

#### Find
`nsGmx.SearchControl.Provider.find(value, limit, strong, retrieveGeometry)` - выполняет поиск введённых в строку объектов.

| Параметр | Возвращает | Тип данных | Описание | Значение по умолчанию |
|----------|------------|------------|:---------|-----------------------|
| value | `this` | String | Поисковая строка | [] |
| limit | `this` | Int | Количество элементов, возвращаемых провайдером при поиске | 10 |
| strong | `this` | Bool | Строгий поиск объектов | false |
| retrieveGeometry | `this` | Bool | Возвращает геометрию объектов | false |

#### Fetch
`nsGmx.SearchControl.Provider.fetch (obj)` - возвращает искомый объект со всеми метаданными.

| Параметр | Возвращает | Тип данных | Описание | Значение по умолчанию |
|----------|------------|------------|:---------|-----------------------|
| obj | `this` | Object | Объект поиска | Null |

Имеется возможность реализовать собственный провайдер, указав соответствующие методы (`Find` и `Fetch`)
