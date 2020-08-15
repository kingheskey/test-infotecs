// Создание структуры таблицы

/* id таблицы - dataTable, далее id и class не назначаются во избежание конфликта
    с имеющимися элементами сайта (если представить будто они существуют) */
document.body.insertAdjacentHTML('afterbegin', '<table id="dataTable"><thead><tr></tr></thead><tbody></tbody></table>');
const table = document.querySelector('#dataTable');
const tr = table.querySelector('#dataTable tr');
const tbody = table.querySelector('tbody');
document.body.prepend(table);

createHeader();
getData('./data.json');

// ****ФУНКЦИИ

function createHeader() {
  const headerTitles = ['Имя', 'Фамилия', 'Описание', 'Цвет глаз'];
  headerTitles.forEach((title) => tr.insertAdjacentHTML('beforeend', `<th>${title}</th>`));
}

// Добавление информации из json объекта в таблицу
async function getData(url) {
  const response = await fetch(url);
  const jsonData = await response.json();

  jsonData.forEach((elem) => tbody.insertAdjacentHTML('beforeend',
    `<tr>
    <td class='sort'>${elem.name.firstName}</td>
    <td class='sort'>${elem.name.lastName}</td>
    <td class='sort'><div class ='about'>${elem.about}</div></td>
    <td class='sort'>${elem.eyeColor}</td>`));
}
