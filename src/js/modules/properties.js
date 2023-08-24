import propertiesList from "./propertiesList.js";
import saveHtmlChanges from "./saveHtmlChanges.js";
import startListener from "./startListener.js";
import showBlock from "./showBlock.js";
import useFunctionsOnPageSeveralTimes from "./use-function-on-page-several-times.js";
import useFunctionsOnPage from "./use-functions-on-page.js";
import getFunctionResultFromPage from "./getFunctionResultFromPage.js";

const properties = function () {
    const addBtn = document.querySelector('.template_change'),
        list = document.querySelector('[name="properties-list"]'),
        addProp = document.querySelector('.add-prop-to-template'),
        template = document.querySelector('.template'),
        ol = template.querySelector('ol'),
        findPropOnPage = document.querySelector('.properties__find-prop'),
        addPropsFormOnPage = document.querySelector('.properties__add-prop-form'),
        addPropsValueOnPage = document.querySelector('.properties__add-prop-value'),
        changeAllPropsOnPage = document.querySelector('.properties__change-prop-value');
    

    document.addEventListener("DOMContentLoaded", function () {
    // when opening the extension page, loads a copy of the body tag from localStorage if there is a copy
        const savedHtmlContent = localStorage.getItem("savedHtmlContent");
        if (savedHtmlContent) {

            document.querySelector('.htmlContent').innerHTML = savedHtmlContent;
            
            startListener(
                document.querySelector('[name="properties-list"]'), 
                'change', 
                () => switchProps(document.querySelector('[name="properties-list"]')
            ));

            startListener(document.querySelector('.add-prop-to-template'), 'click', addingPropListToTemplate);
            
            document.querySelector('.template ol').addEventListener('click', (e) => {
                const target = e.target;
                if (target && target.classList.contains('delFromTemplate')) {
                    const valueCode = target.parentNode.textContent.slice(0, 4);
                    target.parentNode.remove();
                    delete proplistInTemp[valueCode];
                    console.log(proplistInTemp);
                    savePropTempToLocalStorage('propTemplate', proplistInTemp);
                    saveHtmlChanges();
                }
            });

            document.querySelector('.properties__find-prop').addEventListener('click', () => {

                getFunctionResultFromPage(getPropListFromPage)
                    .then(function (result) {
                        missingPropsList = getMissingPropsList(result);
                        savePropTempToLocalStorage('missingPropList', missingPropsList);
                        console.log(missingPropsList);
                    }).catch(function (error) {
                        console.log(error);
                    });
            });

            document.querySelector('.properties__add-prop-form').addEventListener('click', () => {
                const missingProps = Object.keys(getPropTempFromLocalStorage('missingPropList'));

                
                (async function () {
                    for (let i = 0; i < missingProps.length; i++) {
                        await getFunctionResultFromPage(addPropToPage, missingProps[i]);
                    }
                })();
            });

            document.querySelector('.properties__add-prop-value').addEventListener('click', () => {
                const missingProps = Object.keys(getPropTempFromLocalStorage('missingPropList'));
                missingPropsList = getPropTempFromLocalStorage('missingPropList');
                
                (async function () {
                    for (let i = 0; i < missingProps.length; i++) {
                        const propCode = missingProps[i];
                        const propValueCode = missingPropsList[missingProps[i]];
                        await getFunctionResultFromPage(fillInPropValues, propCode, propValueCode);
                    }
                })();
            });

            // document.querySelector('.properties__change-prop-value').addEventListener('click', () => {
            //     const propListFromTemp = Object.keys(getPropTempFromLocalStorage('propTemplate'));
            //     proplistInTemp = getPropTempFromLocalStorage('propTemplate');

            //     (async function () {
            //         for (let i = 0; i < propListFromTemp.length; i++) {
            //             const propCode = propListFromTemp[i];
            //             const propValueCode = proplistInTemp[propListFromTemp[i]];
            //             await getFunctionResultFromPage(fillInPropValues, propCode, propValueCode);
            //         }
            //     })();
            // });
        }
    });

    let proplistInTemp = {};
    let missingPropsList = {};

    if (localStorage.getItem('propTemplate')) {
        proplistInTemp = getPropTempFromLocalStorage('propTemplate');
    }

    if (localStorage.getItem('missingPropList')) {
        missingPropsList = getPropTempFromLocalStorage('missingPropList');
    }
    
    startListener(addBtn, 'click', () => showBlock(template));
    startListener(list, 'change', () => switchProps(list));
    
    function createInput() {
        const input = document.createElement('input');
        input.classList.add('properties-value');
        document.querySelector('.template ol').lastElementChild.insertBefore(input, document.querySelector('.add-prop-to-template'));
    }

    function createBoolean() {
        const boolean = document.createElement('ul');
        boolean.innerHTML = `
            <li>
                <label>
                    <input type="radio" value="True"> Да
                </label>
            </li>
            <li>
                <label>
                    <input type="radio" value="False"> Нет
                </label>
            </li>
        `;
        boolean.classList.add('properties-value');

        boolean.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const target = e.target;
                boolean.querySelectorAll('input[type="radio"]').forEach(input => {
                    input.checked = false;
                });
                target.checked = true;
            });
        });

        document.querySelector('.template ol').lastElementChild.insertBefore(boolean, document.querySelector('.add-prop-to-template'))
    }

    function createSelect(...elem) {
        const select = document.createElement('select');
        select.classList.add('properties-value');
        for (let i = 0; i <= elem.length; i++) {
            let option = document.createElement('option');
            if (i == 0) {
                option.textContent = '---------';
                option.setAttribute("value", "");

            } else {
                option.textContent = elem[i - 1].slice(0, -4);
                option.setAttribute("value", elem[i - 1].slice(-4));
            }
            select.appendChild(option);
        }
        document.querySelector('.template ol').lastElementChild.insertBefore(select, document.querySelector('.add-prop-to-template'))
    }

    function createChekboxForm(...elem) {
        const ul = document.createElement('ul');
        ul.classList.add('properties-value');
        for (let i = 1; i <= elem.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = `
                <label>
                    <input type="checkbox" value=${elem[i - 1].slice(-4)}>
                    ${elem[i - 1].slice(0, -4)}
                </label>
            `;
            ul.appendChild(li);
        }
        document.querySelector('.template ol').lastElementChild.insertBefore(ul, document.querySelector('.add-prop-to-template'))
    }
    
    function removeClass(item, itemClass) {
        if (item.classList.contains(itemClass)) {
            item.classList.remove(itemClass);
        }
    }

    function removePropertiesValueForm() {
        const valueBlock = document.querySelector('.properties-value');
        const addProp = document.querySelector('.add-prop-to-template');
        
        if (valueBlock) {
            valueBlock.remove();
            removeClass(addProp, 'warn');
        } else {
            removeClass(addProp, 'warn');
        }
    }
    
    function getValue(elem, codeWithText = true) {
        if (codeWithText) {
            if (elem.nodeName === 'SELECT') {
                return `${elem.value} ${elem.selectedOptions[0].text}`;
            } else if (elem.nodeName === 'UL') {
                const checkedInputs = elem.querySelectorAll('input:checked');

                if (checkedInputs.length === 1) {
                    return `${checkedInputs[0].value} ${checkedInputs[0].parentNode.textContent.trim()}`;
                } else {
                    let listOfValues = [];
                    checkedInputs.forEach(item => {
                        listOfValues.push(`${item.value} ${item.parentNode.textContent.trim()}`);
                    });
                    return listOfValues.join(', ');
                }
            } else {
                return elem.value;
            }
        } else {
            if (elem.nodeName === 'SELECT') {
                if (elem.value === '') {
                    return '';
                } else {
                    return +elem.value;
                }
            } else if (elem.nodeName === 'UL') {
                const checkedInputs = elem.querySelectorAll('input:checked');

                if (checkedInputs.length === 1) {
                    if (checkedInputs[0].value === 'True') {
                        return true;
                    } else if (checkedInputs[0].value > 1) {
                        return +checkedInputs[0].value;
                    } else {
                        return false;
                    }
                } else if (checkedInputs.length > 1) {
                    let listOfValues = [];
                    checkedInputs.forEach(item => {
                        listOfValues.push(+item.value);
                    });
                    return listOfValues;
                } else {
                    return '';
                }
            } else {
                return elem.value;
            }
        }
    }

    function switchProps(item) {
        
        switch (item.value) {
            case '5261': // Бабочка
                removePropertiesValueForm();
                createBoolean();
                break;
            case '5188': // Вариативность цвета
                removePropertiesValueForm();
                createSelect('V18934', 'V28858', 'V38859', 'V48860');
                break;
            case '5242': // Влагопоглощаемость
                removePropertiesValueForm();
                createSelect(
                    'Группа BIa – влагопоглощение – Eb ≤ 0,5%9359',
                    'Группа BIb – влагопоглощение 0,5% < Eb ≤ 3%9360',
                    'Группа BIIa – влагопоглощение 3% < Eb ≤ 6%9361',
                    'Группа BIIb – влагопоглощение 6% < Eb ≤ 10%9362',
                    'Группа BIII – влагопоглощение Eb > 10%9363'
                );
                break;
            case '5074': // Износостойкость PEI
                removePropertiesValueForm();
                createSelect(
                    '08283',
                    '18284',
                    '28285',
                    '38286',
                    '48287',
                    '58288'
                );
                break;
            case '4933': // Количество цветов
                removePropertiesValueForm();
                createChekboxForm(
                    ' Моноколор8052',
                    ' Микс8054'
                );
                break;
            case '4286': // Материал
                removePropertiesValueForm();
                createSelect(
                    'Керамика6351',
                    'Керамогранит6352',
                    'Клинкер6353',
                    'Камень6354',
                    'Стекло6355',
                    'Перламутр6648',
                    'Дерево6649',
                    'Эклектика6650',
                    'Мрамор6651',
                    'Травертин7036',
                    'Оникс8092',
                    'Лаймстоун8093',
                    'Бетон8109',
                    'Гипс8110',
                    'Бамбук8130',
                    'Металл8131',
                    'Латунь8155',
                );
                break;
            case '4935': // Микс
                removePropertiesValueForm();
                createBoolean();
                break;
            case '4293': // Морозоустойчивость
                removePropertiesValueForm();
                createBoolean();
                break;
            case '4284': // Обработка
                removePropertiesValueForm();
                createChekboxForm(
                    ' структурированная6347',
                    ' натуральная6345',
                    ' лапатированная6344',
                    ' состаренная8001',
                    ' патинированная6348',
                    ' полированная6343',
                    ' ректифицированная6346',
                    ' сатинированная7124',
                    ' Lux7931',
                );
                break;
            case '4283': // Отражение поверхности
                removePropertiesValueForm();
                createSelect(
                    'Глянцевая6340',
                    'Матовая6341',
                    'Полуматовая8055',
                    'Не матовая/не глянцевая6342',
                    'Матовая / глянцевая9934',
                    'Полуполированная9992',
                );
                break;
            case '4285': // Покрытие
                removePropertiesValueForm();
                createSelect(
                    'Глазурованная6349',
                    'Неглазурованная6350',
                    'Sugar эффект8096'
                );
                break;
            case '4950': // Противоскользящая
                removePropertiesValueForm();
                createBoolean();
                break;
            case '5346': // С капиносом
                removePropertiesValueForm();
                createBoolean();
                break;
            case '5073': // Сопротивление скольжению
                removePropertiesValueForm();
                createSelect(
                    'R 98278',
                    'R 108279',
                    'R 118280',
                    'R 128281',
                    'R 138282'
                );
                break;
            case '4934': // Тип скрепления
                removePropertiesValueForm();
                createChekboxForm(
                    ' на сетке8053',
                    ' на полимерной сцепке8075',
                    ' на бумаге8090'
                );
                break;
            case '5377': // Тональная вариация
                removePropertiesValueForm();
                createSelect(
                    'выраженная9929',
                    'минимальная9930',
                    'не определена9931',
                    'отсутствует9932',
                    'сильная9933'
                );
                break;
            case '5381': // Устойчивость к образованию пятен
                removePropertiesValueForm();
                createSelect(
                    'Класс 19935',
                    'Класс 29936',
                    'Класс 39937',
                    'Класс 49938',
                    'Класс 59939'
                );
                break;
            case '4929': // Форма чипа у мозаики
                removePropertiesValueForm();
                createChekboxForm(
                    ' арабески / фигурная8056',
                    ' восьмиугольник / octogonal8048',
                    ' другая8051',
                    ' квадрат8046',
                    ' овал/круг8050',
                    ' прямоугольник8045',
                    ' ромб8049',
                    ' шестиугольник / hexagonal8047',
                    ' треугольник8058'
                );
                break;
            case '4928': // Чипы разного размера у мозаики
                removePropertiesValueForm();
                createBoolean();
                break;
            case '': // ---------
                removePropertiesValueForm();
                break;
            default:
                removePropertiesValueForm();
                createInput();
        }
    }

    function savePropTempToLocalStorage(name, object) {
        localStorage.setItem(name, JSON.stringify(object));
    }
    
    function getPropTempFromLocalStorage(name) {
        return JSON.parse(localStorage.getItem(name));
    }

    function getPropListFromPage() {
        const allPropsOnPage = document.querySelectorAll(
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' +
            '[id$="-attribute"]' +
            ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])'
            );
        const allPropsOnPageValues = document.querySelectorAll(
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' +
            '[id$="-value"]' +
            ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])'
        );

        // позже доработать добавление этой функции в качестве аргумента
        function getValue(elem) {
            if (elem.nodeName === 'SELECT') {
                return `${elem.value} ${elem.selectedOptions[0].text}`;
            } else if (elem.nodeName === 'UL') {
                const checkedInputs = elem.querySelectorAll('input:checked');

                if (checkedInputs.length === 1) {
                    return `${checkedInputs[0].value} ${checkedInputs[0].parentNode.textContent.trim()}`;
                } else {
                    let listOfValues = [];
                    checkedInputs.forEach(item => {
                        listOfValues.push(`${item.value} ${item.parentNode.textContent.trim()}`);
                    });
                    return listOfValues.join(', ');
                }
            } else {
                return elem.value;
            }
        }
        
        const propsOnPageList = {};
        
        allPropsOnPage.forEach((prop, i) => {
            propsOnPageList[prop.value] = getValue(allPropsOnPageValues[i]);
        });

        
        return propsOnPageList;
    }
    
    function getMissingPropsList(propList) {
        const listOfPropsFromTemp = Object.keys(proplistInTemp), // list of props from Template
            allPropsOnPage = Object.keys(propList), // list of props from page
            filteredPropList = []; // a list of property names to be added will be stored here

        listOfPropsFromTemp.forEach(prop => { // getting the names of the properties to be added
            if (!allPropsOnPage.includes(prop)) { // check for no matches
                filteredPropList.push(+prop); // if the condition is true, then adding to the array as a number
            }
        });
        // here an object is formed and returned in which the necessary property and its value are added
        return filteredPropList.reduce((acc, prop) => { 
        
            if (proplistInTemp.hasOwnProperty(prop)) {
                acc[prop] = proplistInTemp[prop];
            }
            return acc;
        }, {});
    }
    
    function addingPropListToTemplate() {
        const newPropListItem = document.createElement('li'),
            delFromTemplate = document.createElement('button'),
            templateOl = document.querySelector('.template ol'),
            propList = document.querySelector('[name="properties-list"]'),
            propValueBlock = document.querySelector('.properties-value');
        let propValue = '';
        let propValueOnlyCode = '';

        if (getValue(propValueBlock) === undefined) {
            propValue = '';
            propValueOnlyCode = '';
        } else if (getValue(propValueBlock) === '---------') {
            propValue = '';
            propValueOnlyCode = '';
        } else {
            propValue = getValue(propValueBlock);
            propValueOnlyCode = getValue(propValueBlock, false);
        }

        if (propList.value !== '' && !(propList.value in proplistInTemp)) {
            
            newPropListItem.textContent = `${propList.value} ${propList.selectedOptions[0].text} : ${propValue}`;
            delFromTemplate.textContent = 'Удалить';
            delFromTemplate.classList.add('delFromTemplate');

            newPropListItem.appendChild(delFromTemplate);
            templateOl.insertBefore(newPropListItem, templateOl.lastElementChild);

            if (document.querySelector('.add-prop-to-template').classList.contains('warn')) {
                document.querySelector('.add-prop-to-template').classList.remove('warn');
            }

            proplistInTemp[propList.value] = propValueOnlyCode;
            savePropTempToLocalStorage('propTemplate', proplistInTemp);
            console.log(proplistInTemp);
        } else {
            document.querySelector('.add-prop-to-template').classList.add('warn');
        }
    }
    
    function addPropToPage(code) {
        const addNewFormBtn = Array.from(
            document.querySelectorAll('strong')).filter(el => el.textContent.includes('Добавить еще один Свойство')
            )[0].parentElement;

        const clickEvent = new Event('click');
        addNewFormBtn.dispatchEvent(clickEvent);

        let numOfallPropsOnPage = document.querySelectorAll(
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' +
            '[id$="-attribute"]' +
            ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])'
        ).length - 1;

        const prop = document.querySelector(
            '#id_plumbing-attributevalue-content_type-object_id-' +
            numOfallPropsOnPage +
            '-attribute');

        const changeEvent = new Event('change');
        prop.value = code;
        prop.dispatchEvent(changeEvent);
    }

    function fillInPropValues(propCode, propValue) {
        const allPropsOnPage = document.querySelectorAll(
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' +
            '[id$="-attribute"]' +
            ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])'
        );
        const allPropsOnPageValues = document.querySelectorAll(
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' +
            '[id$="-value"]' +
            ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])'
        );
        
        let numOfProp = 0;
        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == propCode) {
                numOfProp = i;
            }
        });

        function setValue() {
            const form = allPropsOnPageValues[numOfProp];

            if (propValue !== '') {
                if (form.tagName === 'UL') {
                    if (form.querySelector('input[type="radio"]')) {
                        const inputs = form.querySelectorAll('input[type="radio"]');
                        if (propValue === true) {
                            inputs[0].click();
                        } else {
                            inputs[1].click();
                        }
                    } else {
                        if (Array.isArray(propValue)) {
                            propValue.forEach(checkbox => {
                                form.querySelector(`input[type="checkbox"][value="${checkbox}"]`).click();
                            });
                        } else {
                            form.querySelector(`input[type="checkbox"][value="${propValue}"]`).click();
                        }
                    }
                } else {
                    const changeEvent = new Event('change');
                    form.value = propValue;
                    form.dispatchEvent(changeEvent);
                }
            }
        }
        setValue();
    }

    if (addProp) {
        startListener(addProp, 'click', addingPropListToTemplate);
        
    }
    ol.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target && target.classList.contains('delFromTemplate')) {
            const valueCode = target.parentNode.textContent.slice(0, 4);
            
            target.parentNode.remove();
            delete proplistInTemp[valueCode];
            savePropTempToLocalStorage('propTemplate', proplistInTemp);
            saveHtmlChanges();
        }
    });
    
    findPropOnPage.addEventListener('click', () => {
        
        getFunctionResultFromPage(getPropListFromPage)
            .then(function(result){
                missingPropsList = getMissingPropsList(result);
                savePropTempToLocalStorage('missingPropList', missingPropsList);
                console.log(missingPropsList);
            }).catch(function(error) {
                console.log(error);
            });
    });

    addPropsFormOnPage.addEventListener('click', () => {
        
        const missingProps = Object.keys(getPropTempFromLocalStorage('missingPropList'));
        
        (async function () {
            for (let i = 0; i < missingProps.length; i++) {
                await getFunctionResultFromPage(addPropToPage, missingProps[i]);
            }
        })();
    });

    addPropsValueOnPage.addEventListener('click', () => {
        const missingProps = Object.keys(getPropTempFromLocalStorage('missingPropList'));
        missingPropsList = getPropTempFromLocalStorage('missingPropList');

        (async function () {
            for (let i = 0; i < missingProps.length; i++) {
                const propCode = missingProps[i];
                const propValueCode = missingPropsList[missingProps[i]];
                await getFunctionResultFromPage(fillInPropValues, propCode, propValueCode);
            }
        })();
    });

    // changeAllPropsOnPage.addEventListener('click', () => {
        
    //     const propListFromTemp = Object.keys(getPropTempFromLocalStorage('propTemplate'));
    //     proplistInTemp = getPropTempFromLocalStorage('propTemplate');

    //     (async function () {
    //         for (let i = 0; i < propListFromTemp.length; i++) {
    //             const propCode = propListFromTemp[i];
    //             const propValueCode = proplistInTemp[propListFromTemp[i]];
    //             await getFunctionResultFromPage(fillInPropValues, propCode, propValueCode);
    //         }
    //     })();
    // });
};

export default properties;



