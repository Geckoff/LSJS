/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    let loading = document.createElement('h2');

    loadingBlock.innerHTML = '';
    filterBlock.style.display = 'none';
    filterResult.innerHTML = '';
    loading.textContent = 'Загрузка...';
    loadingBlock.appendChild(loading);

    let myPromise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.send();
        xhr.addEventListener('load', () => {
            const citiesArr = JSON.parse(xhr.response);

            citiesArr.sort((val1, val2) => {
                if (val1.name < val2.name)
                    return -1;
                if (val1.name > val2.name)
                    return 1;
                if (val1.name === val2.name)
                    return 0;
            });
            resolve(citiesArr);
        });
        xhr.addEventListener('error', reject);
    });

    return myPromise; 
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    if (full.indexOf(chunk) < 0) 
        return false;

    return true;
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let townsPromise;

filterInput.addEventListener('keyup', function(e) {
    let inputVal = e.target.value;

    filterResult.innerHTML = '';
    if (inputVal !== '') {
        townsPromise.forEach((value) => {
            if (isMatching(value, inputVal)) {
                let listElem = document.createElement('li');

                listElem.textContent = value;
                filterResult.appendChild(listElem);    
            }
        });    
    }  
});

function promiseThen() {

    loadTowns()
        .then((citiesArrResp) => {
            const citiesArr = [];

            loadingBlock.innerHTML = '';
            filterBlock.style.display = 'block';
            citiesArrResp.forEach((val) => {
                citiesArr.push(val.name);
            });
            townsPromise = citiesArr;
        },
        () => {
            document.querySelector('#loading-block h2').remove();
            let loadError = document.createElement('h2');
            let loadAgain = document.createElement('button');

            loadError.style.color = 'red';
            loadError.textContent = 'Не удалось загрузить города';
            loadAgain.id = 'try-again';
            loadAgain.textContent = 'Повторить';

            loadingBlock.appendChild(loadError);
            loadingBlock.appendChild(loadAgain);
            loadAgain.addEventListener('click', () => {
                promiseThen();
            });
        });   
}

promiseThen();

export {
    loadTowns,
    isMatching
};
