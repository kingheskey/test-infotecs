
//Получает json из внешнего источника и добавляет в таблицу
async function getData(url) {
    let response = await fetch('./data.json');
    let jsonData = await response.json();

}

getData('.data.json');

