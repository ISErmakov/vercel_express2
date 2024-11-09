// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
/*
ymaps.ready(init);
var myMap,
    myPlacemark;
function init(){
    var cord = $('#coords').text() // адрес
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 7
    });

    var myGeocoder = ymaps.geocode(cord); // пытаюсь передать переменную
    myGeocoder.then(
        function (res) {
            myMap.geoObjects.add(res.geoObjects);

            var adres = result.geoObjects.get(0).properties.get('metaDataProperty').getAll(); // записываю координаты в переменную

            myPlacemark = new ymaps.Placemark([adres], { // пытаюсь передать координаты и поставить метку
                hintContent: 'Москва!',
                balloonContent: 'Столица России'
            });

            myMap.geoObjects.add(myPlacemark);
        },
        function (err) {
            // обработка ошибки
        }
    );

}
*/

//src="https://api-maps.yandex.ru/2.1/?apikey=2b8ef247-bdcd-457e-8a0f-1d166568de18&lang=ru_RU"
let myMap = null;

ymaps.ready(init);
function init(){
    // Создание карты.

    myMap = new ymaps.Map("map", {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [55.76, 67.64],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 4
    });

}

function init1() {
    console.log('init1');
    var myGeocoder = ymaps.geocode("Челябинск г");
    myGeocoder.then(function (res) {

        //alert('s');
        let coord = res.geoObjects.properties.get('metaDataProperty').GeocoderResponseMetaData.Point.coordinates;
        console.log(coord);
        myMap.geoObjects.add(res.geoObjects);
// Выведем в консоль данные, полученные в результате геокодирования объекта.

    }, function (err) {
        // Обработка ошибки.
    });
}