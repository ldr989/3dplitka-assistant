import propertiesList from "./propertiesList.js";
import saveHtmlChanges from "./saveHtmlChanges.js";
import startListener from "./startListener.js";
import showBlock from "./showBlock.js";

// [Ilya]: it's better to name functions as verbs, properties -> buildProperties or renderProperties
// some useful links:
// https://github.com/airbnb/javascript
// https://medium.com/wix-engineering/naming-convention-8-basic-rules-for-any-piece-of-code-c4c5f65b0c09
function properties() {
    // [Ilya]: use variable keyword for each declaration:
    // const addBtn ...
    // const list ...
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

            // [Ilya]: make sure to create and use at the end of code execution oposite function to remove all listeners,
            // to prevent posible memory leak
            startListener(
                document.querySelector('[name="properties-list"]'), 
                'change', 
                () => switchProps(document.querySelector('[name="properties-list"]')
            ));
            startListener(document.querySelector('.add-prop-to-template'), 'click', addingPropListToTemplate);
            // [Ilya]: why not to use startListener here?
            document.querySelector('.template ol').addEventListener('click', (e) => {
                const target = e.target;
                if (target && target.classList.contains('delFromTemplate')) {
                    target.parentNode.remove();
                    saveHtmlChanges();
                }
            });
        }
    });


    // [Ilya]: you can use const here
    let proplistInTemp = {};
    
    startListener(addBtn, 'click', () => showBlock(template));
    startListener(list, 'change', () => switchProps(list));
    
    function createInput() {
        const input = document.createElement('input');
        input.classList.add('properies-input');
        document.querySelector('.template ol').lastElementChild.insertBefore(input, document.querySelector('.add-prop-to-template'));
    }

    function createBoolean(parent, frontElement) {
        const boolean = document.createElement('div');
        boolean.innerHTML = `
            <ul class="properties-value-radio">
                <li>
                    <input type="radio" value="true"> Да
                </li>
                <li>
                    <input type="radio" value="false"> Нет
                </li>
            </ul>
        `;
        boolean.classList.add('properies-boolean');

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

    function removeProperiesValueForm() {
        // [Ilya]: this whole function is very performance inefficient, you call document.querySelector twice for every selector
        // but could call it once and store Node ina variable
        if (document.querySelector('.properies-boolean')) {
            document.querySelector('.properies-boolean').remove();
            if (document.querySelector('.add-prop-to-template').classList.contains('warn')) {
                document.querySelector('.add-prop-to-template').classList.remove('warn');
            }
        } else if (document.querySelector('.properies-input')) {
            document.querySelector('.properies-input').remove();
            if (document.querySelector('.add-prop-to-template').classList.contains('warn')) {
                document.querySelector('.add-prop-to-template').classList.remove('warn');
            }
        } else if (document.querySelector('.properies-select')) {
            document.querySelector('.properies-select').remove();
            if (document.querySelector('.add-prop-to-template').classList.contains('warn')) {
                document.querySelector('.add-prop-to-template').classList.remove('warn');
            }
        } else if (document.querySelector('.properties-ul')) {
            document.querySelector('.properties-ul').remove();
            if (document.querySelector('.add-prop-to-template').classList.contains('warn')) {
                document.querySelector('.add-prop-to-template').classList.remove('warn');
            }
        } else {
            if (document.querySelector('.add-prop-to-template').classList.contains('warn')) {
                document.querySelector('.add-prop-to-template').classList.remove('warn');
            }
        }
    }

    function createSelect(...elem) {
        const select = document.createElement('select');
        select.classList.add('properies-select');
        for (let i = 0; i <= elem.length; i++) {
            let option = document.createElement('option');
            // [Ilya]: strict comparison always: ===
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
        ul.classList.add('properties-ul');
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

    function getPropValue() {
        if (document.querySelector('.properies-boolean')) {
            const booleanInputs = document.querySelectorAll('.properties-value-radio li input');
            // [Ilya]: I would use [...booleanInputs].find(input => input.checked)
            const checkedInput = Array.from(booleanInputs).find(input => input.checked);
            if (checkedInput) {
                // [Ilya]: could be a one line: return checkedInput.value === 'true' ? 'Да' : 'Нет'
                if (checkedInput.value === 'true') {
                    return 'Да';
                } else {
                    return 'Нет';
                }
            }
        } else if (document.querySelector('.properies-input')) {
            return document.querySelector('.properies-input').value;
        } else if (document.querySelector('.properies-select')) {
            return getSelectedOption(document.querySelector('.properies-select'));
        } else if (document.querySelector('.properties-ul')) {
            const checkedChekboxes = document.querySelectorAll('.properties-ul input[type=checkbox]:checked');
            let resultString = '';
            checkedChekboxes.forEach(chekbox => {
                resultString += `, ${chekbox.parentNode.textContent}`;
            });
            return resultString;
        }
    }
    function getSelectedOption(selectElem) {
        
        const selectedIndex = selectElem.selectedIndex,
            selectedOption = selectElem.options[selectedIndex];
        return selectedOption.textContent;
        
    }
    // [Ilya]: Another and more readable way to discribe multy branching logic is to use dictinary of functions
    // Switch is a bad practice, at least on projects I've worked. The greatest way is to use factory or strategy pattern here
    // but simple functions list will do too:
    //
    // const createFormInuts = {
    //  '5261': () => {
    //                   removeProperiesValueForm();
    //                   createBoolean();
    //                 },
    //  '5188': () => {}...
    // }
    //
    function switchProps(item) {
        
        switch (item.value) {
            case '5261': // Бабочка
                removeProperiesValueForm();
                createBoolean();
                break;
            case '5188': // Вариативность цвета
                removeProperiesValueForm();
                createSelect('V18934', 'V28858', 'V38859', 'V48860');
                break;
            case '5242': // Влагопоглощаемость
                removeProperiesValueForm();
                createSelect(
                    'Группа BIa – влагопоглощение – Eb ≤ 0,5%9359',
                    'Группа BIb – влагопоглощение 0,5% < Eb ≤ 3%9360',
                    'Группа BIIa – влагопоглощение 3% < Eb ≤ 6%9361',
                    'Группа BIIb – влагопоглощение 6% < Eb ≤ 10%9362',
                    'Группа BIII – влагопоглощение Eb > 10%9363'
                );
                break;
            case '5074': // Износостойкость PEI
                removeProperiesValueForm();
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
                removeProperiesValueForm();
                createChekboxForm(
                    ' Моноколор8052',
                    ' Микс8054'
                );
                break;
            case '4286': // Материал
                removeProperiesValueForm();
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
                removeProperiesValueForm();
                createBoolean();
                break;
            case '4293': // Морозоустойчивость
                removeProperiesValueForm();
                createBoolean();
                break;
            case '4284': // Обработка
                removeProperiesValueForm();
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
                removeProperiesValueForm();
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
                removeProperiesValueForm();
                createSelect(
                    'Глазурованная6349',
                    'Неглазурованная6350',
                    'Sugar эффект8096'
                );
                break;
            case '4950': // Противоскользящая
                removeProperiesValueForm();
                createBoolean();
                break;
            case '5346': // С капиносом
                removeProperiesValueForm();
                createBoolean();
                break;
            case '5073': // Сопротивление скольжению
                removeProperiesValueForm();
                createSelect(
                    'R 98278',
                    'R 108279',
                    'R 118280',
                    'R 128281',
                    'R 138282'
                );
                break;
            case '4934': // Тип скрепления
                removeProperiesValueForm();
                createChekboxForm(
                    ' на сетке8053',
                    ' на полимерной сцепке8075',
                    ' на бумаге8090'
                );
                break;
            case '5377': // Тональная вариация
                removeProperiesValueForm();
                createSelect(
                    'выраженная9929',
                    'минимальная9930',
                    'не определена9931',
                    'отсутствует9932',
                    'сильная9933'
                );
                break;
            case '5381': // Устойчивость к образованию пятен
                removeProperiesValueForm();
                createSelect(
                    'Класс 19935',
                    'Класс 29936',
                    'Класс 39937',
                    'Класс 49938',
                    'Класс 59939'
                );
                break;
            case '4929': // Форма чипа у мозаики
                removeProperiesValueForm();
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
                removeProperiesValueForm();
                createBoolean();
                break;
            case '': // ---------
                removeProperiesValueForm();
                break;
            default:
                removeProperiesValueForm();
                createInput();
        }
    }

    function addingPropListToTemplate() {
        // [Ilya]: try to avoid sevral function calls in if statements, here you could store result of getPropValue()
        // at the beginnig, check it's value and use or rewrite value after
        if (getPropValue() !== undefined && getPropValue() !== '' && getPropValue() !== '---------') {
            const newPropListItem = document.createElement('li'),
                delFromTemplate = document.createElement('button'),
                templateOl = document.querySelector('.template ol');
            let propValue = getPropValue();

            newPropListItem.textContent = `
                ${getSelectedOption(document.querySelector('[name="properties-list"]'))} : ${propValue}
                `;
            delFromTemplate.textContent = 'Удалить';
            delFromTemplate.classList.add('delFromTemplate');

            newPropListItem.appendChild(delFromTemplate);
            templateOl.insertBefore(newPropListItem, templateOl.lastElementChild);

            if (document.querySelector('.add-prop-to-template').classList.contains('warn')) {
                document.querySelector('.add-prop-to-template').classList.remove('warn');
            }
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
            target.parentNode.remove();
            saveHtmlChanges();
        }
    });
    
}

export default properties;