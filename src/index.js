/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    let myPromise = new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });

    return myPromise;
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
    let myPromise = new Promise((resolve) => {
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
    });

    return myPromise;
}

export {
    delayPromise,
    loadAndSortTowns
};
