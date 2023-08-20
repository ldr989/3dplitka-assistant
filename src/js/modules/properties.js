import propertiesList from "./propertiesList.js";
import saveHtmlChanges from "./saveHtmlChanges.js";
import startListener from "./startListener.js";
import showBlock from "./showBlock.js";

const properties = function () {
    const addBtn = document.querySelector('.template_change'),
        list = document.querySelector('[name="properties-list"]'),
        addProp = document.querySelector('.add-prop-to-template'),
        template = document.querySelector('.template'),
            ol = template.querySelector('ol');
    

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
                    savePropTempToLocalStorage();
                    saveHtmlChanges();
                }
            });
        }
    });

    let proplistInTemp = {};

    if (localStorage.getItem('propTemplate')) {
        proplistInTemp = getPropTempFromLocalStorage();
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
                    <input type="radio" value="true"> Да
                </label>
            </li>
            <li>
                <label>
                    <input type="radio" value="true"> Нет
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
    function savePropTempToLocalStorage() {
        localStorage.setItem('propTemplate', JSON.stringify(proplistInTemp));
    }
    function getPropTempFromLocalStorage() {
        return JSON.parse(localStorage.getItem('propTemplate'));
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
        
        const propsOnPageList = {};
        
        
        allPropsOnPage.forEach((prop, i) => {
            propsOnPageList[prop.value] = allPropsOnPageValues[i];
        });
        
        const filteredPropList = [];

        // allPropsOnPage.forEach(item => {
        //     propsOnPageList[item] = '';
        // });

    }

    // const listOfPropsFromTemp = Object.keys(proplistInTemp);
    // listOfPropsFromTemp.forEach(prop => {
    //     if (!allPropsOnPage.includes(+prop)) {
    //         filteredPropList.push(+prop);
    //     }
    // });
    // const listOfPropToAdd = filteredPropList.reduce((acc, prop) => {
    //     if (proplistInTemp.hasOwnProperty(prop)) {
    //         acc[prop] = proplistInTemp[prop];
    //     }
    //     return acc;
    // }, {});
    
    function addingPropListToTemplate() {
        const newPropListItem = document.createElement('li'),
            delFromTemplate = document.createElement('button'),
            templateOl = document.querySelector('.template ol'),
            propList = document.querySelector('[name="properties-list"]'),
            propValueBlock = document.querySelector('.properties-value');
        let propValue = '';

        if (getValue(propValueBlock) === undefined) {
            propValue = '';
            getValue(propValueBlock);
        } else if (getValue(propValueBlock) === '---------') {
            propValue = '';
            getValue(propValueBlock);
        } else {
            propValue = getValue(propValueBlock);
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

            proplistInTemp[propList.value] = propValue;
            savePropTempToLocalStorage();
            console.log(proplistInTemp);
        } else {
            document.querySelector('.add-prop-to-template').classList.add('warn');
        }
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
            savePropTempToLocalStorage();
            saveHtmlChanges();
        }
    });
    
};

export default properties;