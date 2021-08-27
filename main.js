var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
const countriesAPI = 'https://restcountries.eu/rest/v2/all'

var maxCountry = 10;
var maxLanguage = 10;

const app = {

    handleEvent(countriesData) {
        let populationBtn = $('.nav__btn-link-population');
        let languagesBtn = $('.nav__btn-link-languages');

        this.CounterNumber(countriesData.length, 1000, (value) => {
            $('.number-countries').innerHTML = value;
        });

        populationBtn.onclick = (e)=> {
            this.renderPopulation(countriesData);
        }

        languagesBtn.onclick = (e)=> {
            this.renderLanguages(countriesData);
        }
    },
    CounterNumber(max, duration, callback) {
        let startTime = performance.now();
        let count = 0;
        function updatNumberCountry(currTime) {
            let elapsedTime = currTime - startTime;
            if(count > max) {
                callback(max);
            } else {
                count = Math.round(elapsedTime * max / duration);
                callback(count);
                requestAnimationFrame(updatNumberCountry);
            }
        }

        requestAnimationFrame(updatNumberCountry);
    },
    renderPopulation(countriesData) {
        $('.nav__title').innerHTML = '10 Most populated countries in the world'
        let totalPopulation = countriesData.reduce((acc, value) => {
            return acc + value.population;
        },0)

        countriesData.sort((a,b) =>{
            return b.population - a.population;
        })
        
        let htmls = countriesData.filter((country, index) => {
            return index < maxCountry;
        }).map((country, index) => {
            return `<div class="countries">
            <div class="countries__name" >${country.name}</div>
            <div class="countries__chart-wrapper">
                <div class="countries__chart" style = "width: ${100 * country.population / totalPopulation}%" "></div>
            </div>
            <div class="countries__data-amount countries__data-amount-index-${index + 1}">0</div>
        </div>`
        })
        htmls.unshift(`<div class="countries">
                        <div class="countries__name" >World</div>
                        <div class="countries__chart-wrapper">
                            <div class="countries__chart" style = "width: 100%" "></div>
                        </div>
                        <div class="countries__data-amount countries__data-amount-index-${0}">0</div>
                    </div>`
                    );
        $('main').innerHTML = htmls.join('');
        let listPopulationNumber = Array.from($$('.countries__data-amount'));

        listPopulationNumber.forEach((value, index) => {
            this.CounterNumber(index === 0 ?totalPopulation :countriesData[index].population, 1000, (data) => {
                $(`.countries__data-amount-index-${index}`).innerHTML = data;
            })
        })
    },
    getLanguages(countriesData) {
        let set = new Set();
        countriesData.forEach((value, key) => {
            value.languages.forEach((language) => set.add(language.name));
        })
        return set;
    },
    renderLanguages(countriesData) {
        $('.nav__title').innerHTML = '10 Most Spoken languages in the world'
        let languages = Array.from(this.getLanguages(countriesData));
        let arr = [];
        languages.forEach((language) => {
            let count = 0;
            countriesData.forEach((data) => {
                let num = data.languages.find((value) => {
                    return value.name === language;
                })
                if(num) {
                    count++;
                }
            })
            arr.push([language, count]);
        })
        arr.sort((a,b) =>{
            return b[1] - a[1];
        })
        let htmls = arr.filter((value, index) => {
            return index <= maxLanguage;
        }).map((language, index) => {
            return `<div class="countries">
            <div class="countries__name" >${language[0]}</div>
            <div class="countries__chart-wrapper">
                <div class="countries__chart" style = "width: ${100 * language[1] / languages.length}%" "></div>
            </div>
            <div class="countries__data-amount countries__data-amount-index-${index}">0</div>
        </div>`
        })
        $('main').innerHTML = htmls.join('');
        let listLanguagesNumber = Array.from($$('.countries__data-amount'));

        listLanguagesNumber.forEach((value, index) => {
            this.CounterNumber(arr[index][1], 1000, (data) => {
                $(`.countries__data-amount-index-${index}`).innerHTML = data;
            })
        })
    },
    getData() {
        fetch(countriesAPI)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.handleEvent(data)
        });
    },
    start() {
        this.getData();
    }
}


app.start();