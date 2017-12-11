/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

// getting array of all cookies available
let getCookieArray = () => {
    let cookies = document.cookie.split('; ');
    
    if (cookies.length === 1 && cookies[0] === '') {
    	return false;
    }
    let cookiesObj = cookies.reduce((prevVal, curItem) => {
        const [cookieName, cookieVal] = curItem.split('=');
        prevVal[cookieName] = cookieVal;
        return prevVal;
    }, {});
    return cookiesObj;
}

// building up cookies table
let coockieTable = (cookiesObj) => {
    for (let cookie in cookiesObj) {
        let tableRow = document.createElement('tr');
        let nameCell = document.createElement('td');
        let valueCell = document.createElement('td');
        let deleteCell = document.createElement('td');
        let deleteLink = document.createElement('button');

        nameCell.textContent = cookie;
        valueCell.textContent = cookiesObj[cookie];
        deleteLink.textContent = 'DELETE';
        deleteLink.style.color = 'red';
        deleteLink.setAttribute('href', '#');

        deleteCell.appendChild(deleteLink);
        tableRow.appendChild(nameCell);
        tableRow.appendChild(valueCell);
        tableRow.appendChild(deleteCell);
        listTable.appendChild(tableRow);
    }
}


let isMatching = (full, chunk) => {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    if (full.indexOf(chunk) < 0) 
        return false;
    else
        return true;
}

// filtering cookies
let filterCookies = (chunk) => {
    let allCookies = getCookieArray();
    let filteredCookies = {};

    for (let cookieName in allCookies) {
        if (cookieName.indexOf(chunk) > -1) {
            filteredCookies[cookieName] = allCookies[cookieName];
        }
    }

    return filteredCookies;
}

// deleting table's row
let deleteRow = (a) => {
    a.parentNode.parentNode.remove();   
}

// deleting cookie
let deleteCookie = (cookieName) => {
    let date = new Date(1481407097);
    document.cookie = cookieName + '=0;expires=' + date.toUTCString();
}

// adding cookie
function addCookie(name, value) {
    document.cookie = name + '=' + value;
}

filterNameInput.addEventListener('keyup', function(e) {
    let inputVal = e.target.value;

    listTable.innerHTML = '';
    coockieTable(filterCookies(inputVal));
});

addButton.addEventListener('click', () => {
});

// adding event listner to DELETE link in the table to delete
// table row from the table and cookie from the browser
listTable.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        let cookieName = e.target.parentNode.parentNode.querySelector('td').textContent;
        deleteCookie(cookieName);
        deleteRow(e.target);
    }
});

// emulating keyup for filterNameInput to provide initial table population
window.addEventListener('load', () => {
    var event = new CustomEvent("keyup");
    filterNameInput.dispatchEvent(event);
});

// adding cookies and updating cookies table
addButton.addEventListener('click', () => {
    let cookieName = addNameInput.value;
    let cookieVal = addValueInput.value;

    listTable.innerHTML = '';
    addCookie(cookieName, cookieVal);
    coockieTable(filterCookies(filterNameInput.value));
});
