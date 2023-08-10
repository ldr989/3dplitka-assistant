import propertiesList from "./propertiesList.js";

function properties() {
    const addBtn = document.querySelector('.template_change'),
        list = document.querySelector('[name="properties-list"]'),
        addProp = document.querySelector('.add-prop-to-template'),
        template = document.querySelector('.template'),
            li = template.querySelector('ol li');

    addBtn.addEventListener('click', () => {
        template.style.display = 'block';
        startListener();
    });

    
    function createInput(noText = false) {
        const input = document.createElement('input');
        input.classList.add('properies-input');
        li.insertBefore(input, addProp);
    }

    function createBoolean() {
        const boolean = document.createElement('div');
        boolean.innerHTML = '<ul class="properties-value-radio"><li><input type="radio" value="true"> Да</input></li><li><input type="radio" value="false"> Нет</input></li></ul>';
        boolean.classList.add('properies-boolean');
        function uncheckInputs() {
            boolean.querySelectorAll('input[type="radio"]').forEach(input => {
                input.checked = false;
            });
        }
        boolean.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const target = e.target;
                uncheckInputs();
                target.checked = true;
            });
        });

        li.insertBefore(boolean, addProp);
    }

    function removeProperiesValueForm() {
        if (document.querySelector('.properies-boolean')) {
            document.querySelector('.properies-boolean').remove();
        } else if (document.querySelector('.properies-input')) {
            document.querySelector('.properies-input').remove();
        } else if (document.querySelector('.properies-select')) {
            document.querySelector('.properies-select').remove();
        } else if (document.querySelector('.properties-ul')) {
            document.querySelector('.properties-ul').remove();
        }
    }

    function createSelect(...elem) {
        const select = document.createElement('select');
        select.classList.add('properies-select');
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
        li.insertBefore(select, addProp);
    }

    function createChekboxForm(...elem) {
        const ul = document.createElement('ul');
        ul.classList.add('properties-ul');
        for (let i = 1; i <= elem.length; i++) {
            console.log(elem.length);
            const li = document.createElement('li');
            console.log(elem[i]);
            li.innerHTML = `
                <label>
                    <input type="checkbox" value=${elem[i - 1].slice(-4)}>
                    ${elem[i - 1].slice(0, -4)}
                </label>
            `;
            ul.appendChild(li);
        }
        li.insertBefore(ul, addProp);
    }

    function startListener() {
        list.addEventListener('change', () => {
            if (list.value == 5261) {
                removeProperiesValueForm();
                createBoolean();
            } else if (list.value == 5188) {
                removeProperiesValueForm();
                createSelect('V18934', 'V28858', 'V38859', 'V48860');
            } else {
                removeProperiesValueForm();
                createInput();
            }
            switch(list.value) {
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
                default: 
                    removeProperiesValueForm();
                    createInput();
            }
        });
    }
}

export default properties;