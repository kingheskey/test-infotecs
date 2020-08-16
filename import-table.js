'use strict'

// Создание таблицы с id="dataTable" и header id="dataTableHeader"
document.body.insertAdjacentHTML('afterbegin', '<table id="dataTable"><tr id="dataTableHeader"></tr></table>');

// Глобальные переменные для доступа к элементам таблицы
const table = document.querySelector('#dataTable');
const thead = document.querySelector('#dataTableHeader');
const tbody = table.querySelector('tbody');

document.body.prepend(table);
createHeader();
getData('./data.json');

// ***************************
// Функции

// Создает header таблицы
function createHeader() {
  const headerTitles = ['Имя', 'Фамилия', 'Описание', 'Цвет глаз'];
  headerTitles.forEach((title) => thead.insertAdjacentHTML('beforeend', `<th onclick="tableSortColumn()">${title}</th>`));
}

// Добавление информации из json объекта в таблицу
// {string} url - ссылка на json объект
async function getData(url) {
  const response = await fetch(url);
  const jsonData = await response.json();

  // Для каждой строки массива jsonData создается строка в таблице по заданному шаблону
  /* elem.about завернут в div т.к. при назначении display:-webkit-inline-box
  непосредственно элементу <td>, border элемета <td> отображается некорректно */
  jsonData.forEach((elem) => tbody.insertAdjacentHTML('beforeend',
    `<tr onclick="selectedRowEdit()">
    <td>${elem.name.firstName}</td>
    <td>${elem.name.lastName}</td>
    <td><div class ='about'>${elem.about}</div></td>
    <td>${elem.eyeColor}</td>
    </tr>`));
}

/* Сортировка колонны по значениям
Создает классы asc - для сортировки по возрастанию и desc - для сортировки по убыванию */
function tableSortColumn() {
  const target = event.currentTarget;
  const targetId = Array.from(thead.cells).indexOf(target);

  // Первый table.row - header, его пропускаем
  const sortedRows = Array.from(table.rows).slice(1);

  /* Условие стирает классы asc и desc всех элементов если мы сортируем
  другой столбец */
  if (!(target.classList.contains('asc')) || (target.classList.contains('desc'))) {
    Array.from(thead.children).forEach((element) => {
      element.classList.remove('asc', 'desc');
    });
  }
  /*
  1. При первом использовании сортировки и при переходе на другие столбцы
  устанавливается class = "asc" => 1 условие;
  2. При повторном использовании toggle стирает class = "asc" с элемента => 2 условие,
  устанавливает class="desc";
  3. При третьем использовании toggle меняет "desc" на "asc" => 1 условие */
  target.classList.toggle('asc');

  // 1 условие
  if (target.classList.contains('asc')) {
    sortedRows.sort((rowA, rowB) => {
      if (rowA.cells[targetId].innerHTML < rowB.cells[targetId].innerHTML) {
        return -1;
      } return 1;
    });
    tbody.append(...sortedRows);
  // 2 условие
  } else {
    target.classList.toggle('desc');
    sortedRows.sort((rowA, rowB) => {
      if (rowA.cells[targetId].innerHTML > rowB.cells[targetId].innerHTML) {
        return -1;
      } return 1;
    });
    tbody.append(...sortedRows);
  }
}

function selectedRowEdit() {
  const target = event.currentTarget;
  document.body.insertAdjacentHTML('beforeend', '<form id="edit-selected"></form>');
}

