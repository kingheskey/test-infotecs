/* eslint-disable strict */

'use strict';

// Создание таблицы с id="dataTable" и header id="dataTableHeader"
document.body.insertAdjacentHTML('afterbegin', '<table id="dataTable"><tr id="dataTableHeader"></tr></table>');

// Глобальные переменные для доступа к элементам таблицы
const table = document.querySelector('#dataTable');
const thead = document.querySelector('#dataTableHeader');
const tbody = table.querySelector('tbody');

let currentPage = 0;

// Вставка элемента-обертки для таблицы
document.body.insertAdjacentHTML('afterbegin', '<div class = "wrapper"></div>');
const wrapper = document.querySelector('.wrapper');
wrapper.appendChild(table);

wrapper.insertAdjacentHTML('afterend', '<form id="visibility-form"></form>');
wrapper.insertAdjacentHTML('afterend', '<form id="data-change-form" onsubmit = "submitDataChange()"></form>');

const visibilityForm = document.querySelector('#visibility-form');
const dataChangeForm = document.querySelector('#data-change-form');

// Вставка кнопок для перехода по страницам таблицы
table.insertAdjacentHTML('beforebegin', '<div class="change-page" id="previous" onclick="previousPage()"></div>');
table.insertAdjacentHTML('afterend', '<div class="change-page" id="next" onclick="nextPage()"></div>');

const previousButton = wrapper.querySelector('#previous');
const nextButton = wrapper.querySelector('#next');

// Заполнение таблицы
createHeader();
getData('./data.json');
createVisibilityForm();
createDataChangeForm();
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
  jsonData.forEach((elem) => {
    tbody.insertAdjacentHTML('beforeend',
      `<tr onclick="selectRow()">
    <td>${elem.name.firstName}</td>
    <td>${elem.name.lastName}</td>
    <td><div class ='about'>${elem.about}</div></td>
    <td style = "background-color: ${elem.eyeColor}; font-size: 0;">${elem.eyeColor}</td>
    </tr>`);
  });
  const dataRows = Array.from(table.rows).slice(1);
  setHidden(dataRows);
}

/* Сортировка колонны по значениям
Создает классы asc - для сортировки по возрастанию и desc - для сортировки по убыванию */
// eslint-disable-next-line no-unused-vars
function tableSortColumn() {
  // eslint-disable-next-line no-restricted-globals
  const target = event.currentTarget;
  const targetId = Array.from(thead.cells).indexOf(target);

  // Первый table.row - header, его пропускаем
  const dataRows = Array.from(table.rows).slice(1);

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
    dataRows.sort((rowA, rowB) => {
      if (rowA.cells[targetId].innerHTML.toLowerCase()
      < rowB.cells[targetId].innerHTML.toLowerCase()) {
        return -1;
      }
      return 1;
    });
    tbody.append(...dataRows);
    setHidden(dataRows);
    // 2 условие
  } else {
    target.classList.toggle('desc');
    dataRows.sort((rowA, rowB) => {
      if (rowA.cells[targetId].innerHTML.toLowerCase()
      > rowB.cells[targetId].innerHTML.toLowerCase()) {
        return -1;
      }
      return 1;
    });
    tbody.append(...dataRows);
    setHidden(dataRows);
  }
}

// Скрыть элементы, не относящиеся к текущей странице
// {array} data - список всех строк таблицы
function setHidden(data) {
  data.forEach((elem, id) => {
    if (id >= currentPage * 10 && id <= currentPage * 10 + 9) {
      elem.hidden = false;
    } else {
      elem.hidden = true;
    }
  });

  // Условие видимости кнопок перехода по страницам
  if (currentPage === 0) {
    previousButton.style.visibility = 'hidden';
  } else if (currentPage > 0 && currentPage < 4) {
    previousButton.style.visibility = 'visible';
    nextButton.style.visibility = 'visible';
  } else if (currentPage === 4) {
    nextButton.style.visibility = 'hidden';
  }
}

// eslint-disable-next-line no-unused-vars
function nextPage() {
  currentPage++;
  setHidden(Array.from(table.rows).slice(1));
}

// eslint-disable-next-line no-unused-vars
function previousPage() {
  currentPage--;
  setHidden(Array.from(table.rows).slice(1));
}

function createVisibilityForm() {
  Array.from(thead.children).forEach((elem, id) => {
    visibilityForm.insertAdjacentHTML('beforeend', `<input type="checkbox" id="checkbox-${id}" onchange="setVisibility()">
    <label for="checkbox-${id}">${[elem.textContent]}</label><br>`);
  });
  // eslint-disable-next-line no-unused-vars
}

function setVisibility() {
  // eslint-disable-next-line no-restricted-globals
  const target = event.currentTarget;
  const targetId = Array.from(visibilityForm.elements).indexOf(target);
  const dataRows = Array.from(table.rows);

  dataRows.forEach((row) => {
    Array.from(row.children).forEach((cell) => {
      if (Array.from(row.children).indexOf(cell) === targetId) {
        cell.classList.toggle('hidden');
      }
    });
  });
}

function createDataChangeForm() {
  Array.from(thead.children).forEach((elem) => {
    dataChangeForm.insertAdjacentHTML('beforeend', `<label>${[elem.textContent]}<textarea class="textarea">`);
  });
  dataChangeForm.insertAdjacentHTML('beforeend', '<input type ="submit"></input>');
}

function selectRow() {
  const target = event.currentTarget;
  const targetId = Array.from(tbody.children).indexOf(target);
  const textareaArr = Array.from(dataChangeForm.querySelectorAll('textarea'));
  textareaArr.forEach((textarea, id) => {
    textarea.setAttribute('placeholder', `${Array.from(target.children)[id].innerText}`);
    dataChangeForm.setAttribute('changable-now', `${targetId}`);
  });
}

function submitDataChange() {
  event.preventDefault();
  const targetId = dataChangeForm.getAttribute('changable-now');
  const targetRow = Array.from(tbody.children)[targetId];

  const targetTextArr = [];
  Array.from(targetRow.children).forEach((cell) => targetTextArr.push(cell.innerText));

  const newData = [];
  Array.from(dataChangeForm.querySelectorAll('textarea')).forEach((textarea) => {
    newData.push(textarea.value);
  });

  newData.forEach((data, id) => {
    if (data !== '') {
      targetRow.children[id].innerText = data;
    }
  });
}
