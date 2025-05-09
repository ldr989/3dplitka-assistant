import saveHtmlChanges from "./saveHtmlChanges.js";
import startListener from "./startListener.js";
import showBlock from "./showBlock.js";
import useFunctionsOnPage from "./use-functions-on-page.js";
import getFunctionResultFromPage from "./getFunctionResultFromPage.js";

const properties = function () {
    const addBtn = document.querySelector(".template_change"),
        list = document.querySelector('[name="properties-list"]'),
        addProp = document.querySelector(".add-prop-to-template"),
        template = document.querySelector(".template"),
        ol = template.querySelector("ol"),
        prop = document.querySelector(".properties"),
        findPropOnPage = document.querySelector(".properties__find-prop"),
        addPropsFormOnPage = document.querySelector(
            ".properties__add-prop-form"
        ),
        addPropsValueOnPage = document.querySelector(
            ".properties__add-prop-value"
        ),
        changeAllPropsOnPage = document.querySelector(
            ".properties__change-prop-value"
        ),
        calcAreaBtn = document.querySelector(".calculate-tile-area"),
        calcM2Btn = document.querySelector(".calculate-m2-in-a-box"),
        calcTileWeightBtn = document.querySelector(".calculate-tile-weight"),
        calcTilesInBox = document.querySelector(".calculate-amount-in-a-box"),
        calcM2WeightBtn = document.querySelector(".calculate-м2-weight"),
        calcWeightInBox = document.querySelector(".calculate-weight-in-a-box"),
        calcBoxesInPalletBtn = document.querySelector(
            ".calculate-boxes-in-pallet"
        ),
        calcM2InPalletBtn = document.querySelector(".calculate-m2-in-pallet"),
        calcWeightInPalletBtn = document.querySelector(
            ".calculate-weight-in-pallet"
        );

    document.addEventListener("DOMContentLoaded", function () {
        // when opening the extension page, loads a copy of the body tag from localStorage if there is a copy
        const savedHtmlContent = localStorage.getItem("savedHtmlContent");
        if (savedHtmlContent) {
            document.querySelector(".htmlContent").innerHTML = savedHtmlContent;

            startListener(
                document.querySelector('[name="properties-list"]'),
                "change",
                () =>
                    switchProps(
                        document.querySelector('[name="properties-list"]')
                    )
            );

            startListener(
                document.querySelector(".add-prop-to-template"),
                "click",
                addingPropListToTemplate
            );

            document
                .querySelector(".properties")
                .addEventListener("click", (e) => {
                    if (e.target.classList.contains("properties-value")) {
                        document.addEventListener("keydown", handleEnterKey);
                    }
                });

            document
                .querySelector(".template ol")
                .addEventListener("click", (e) => {
                    const target = e.target;
                    if (
                        target &&
                        target.classList.contains("delFromTemplate")
                    ) {
                        const valueCode = target.parentNode.textContent.slice(
                            0,
                            4
                        );
                        target.parentNode.remove();
                        delete proplistInTemp[valueCode];
                        console.log(proplistInTemp);
                        savePropTempToLocalStorage(
                            "propTemplate",
                            proplistInTemp
                        );
                        saveHtmlChanges();
                    }
                });

            document
                .querySelector(".properties__find-prop")
                .addEventListener("click", () => {
                    getFunctionResultFromPage(getPropListFromPage)
                        .then(function (result) {
                            missingPropsList = getMissingPropsList(result);
                            savePropTempToLocalStorage(
                                "missingPropList",
                                missingPropsList
                            );
                            console.log(missingPropsList);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                });

            document
                .querySelector(".properties__add-prop-form")
                .addEventListener("click", () => {
                    const missingProps = Object.keys(
                        getPropTempFromLocalStorage("missingPropList")
                    );

                    (async function () {
                        for (let i = 0; i < missingProps.length; i++) {
                            await getFunctionResultFromPage(
                                addPropToPage,
                                missingProps[i]
                            );
                        }
                    })();
                });

            document
                .querySelector(".properties__add-prop-value")
                .addEventListener("click", () => {
                    const missingProps = Object.keys(
                        getPropTempFromLocalStorage("missingPropList")
                    );
                    missingPropsList =
                        getPropTempFromLocalStorage("missingPropList");

                    (async function () {
                        for (let i = 0; i < missingProps.length; i++) {
                            const propCode = missingProps[i];
                            const propValueCode =
                                missingPropsList[missingProps[i]];
                            await getFunctionResultFromPage(
                                fillInPropValues,
                                propCode,
                                propValueCode
                            );
                        }
                    })();
                });

            document
                .querySelector(".properties__change-prop-value")
                .addEventListener("click", () => {
                    proplistInTemp =
                        getPropTempFromLocalStorage("propTemplate");
                    const propListFromTemp = Object.keys(proplistInTemp);

                    (async function () {
                        for (let i = 0; i < propListFromTemp.length; i++) {
                            const propCode = propListFromTemp[i];
                            const propValueCode =
                                proplistInTemp[propListFromTemp[i]];
                            await getFunctionResultFromPage(
                                fillInPropValues,
                                propCode,
                                propValueCode
                            );
                        }
                    })();
                });

            document
                .querySelector(".calculate-tile-area")
                .addEventListener("click", () => {
                    useFunctionsOnPage(calculateTileArea);
                });

            document
                .querySelector(".calculate-m2-in-a-box")
                .addEventListener("click", () => {
                    useFunctionsOnPage(calculateM2InBox);
                });

            document
                .querySelector(".calculate-tile-weight")
                .addEventListener("click", () => {
                    useFunctionsOnPage(calculateWeightOfTile);
                });

            document
                .querySelector(".calculate-м2-weight")
                .addEventListener("click", () => {
                    useFunctionsOnPage(calculateWeightOfTileM2);
                });

            document
                .querySelector(".calculate-weight-in-a-box")
                .addEventListener("click", () => {
                    useFunctionsOnPage(calculateWeightOfBox);
                });

            document
                .querySelector(".calculate-boxes-in-pallet")
                .addEventListener("click", () => {
                    useFunctionsOnPage(calculateBoxesInPallet);
                });

            document
                .querySelector(".calculate-m2-in-pallet")
                .addEventListener("click", () => {
                    useFunctionsOnPage(calculateM2InPallet);
                });

            document
                .querySelector(".calculate-weight-in-pallet")
                .addEventListener("click", () => {
                    useFunctionsOnPage(calculateWeightOfPallet);
                });

            document
                .querySelector(".calculate-amount-in-a-box")
                .addEventListener("click", () => {
                    useFunctionsOnPage(calculateTilesInBox);
                });
        }
    });

    let proplistInTemp = {};
    let missingPropsList = {};

    if (localStorage.getItem("propTemplate")) {
        proplistInTemp = getPropTempFromLocalStorage("propTemplate");
    }

    if (localStorage.getItem("missingPropList")) {
        missingPropsList = getPropTempFromLocalStorage("missingPropList");
    }

    startListener(addBtn, "click", () => showBlock(template));
    startListener(list, "change", () => switchProps(list));

    function createInput() {
        const input = document.createElement("input");
        input.classList.add("properties-value");
        document
            .querySelector(".template ol")
            .lastElementChild.insertBefore(
                input,
                document.querySelector(".add-prop-to-template")
            );
    }

    function handleEnterKey(event) {
        if (event.key === "Enter") {
            // проверяем, была ли нажата клавиша Enter
            event.preventDefault();
            addingPropListToTemplate();
            savePropTempToLocalStorage("propTemplate", proplistInTemp);
            saveHtmlChanges();
            document.removeEventListener("keydown", handleEnterKey);
        }
    }

    function createBoolean() {
        const boolean = document.createElement("ul");
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
        boolean.classList.add("properties-value");

        boolean.querySelectorAll('input[type="radio"]').forEach((input) => {
            input.addEventListener("change", (e) => {
                const target = e.target;
                boolean
                    .querySelectorAll('input[type="radio"]')
                    .forEach((input) => {
                        input.checked = false;
                    });
                target.checked = true;
            });
        });

        document
            .querySelector(".template ol")
            .lastElementChild.insertBefore(
                boolean,
                document.querySelector(".add-prop-to-template")
            );
    }

    function createSelect(...elem) {
        const select = document.createElement("select");
        select.classList.add("properties-value");
        for (let i = 0; i <= elem.length; i++) {
            let option = document.createElement("option");
            if (i == 0) {
                option.textContent = "---------";
                option.setAttribute("value", "");
            } else {
                option.textContent = elem[i - 1].slice(0, -4);
                option.setAttribute("value", elem[i - 1].slice(-4));
            }
            select.appendChild(option);
        }
        document
            .querySelector(".template ol")
            .lastElementChild.insertBefore(
                select,
                document.querySelector(".add-prop-to-template")
            );
    }

    function createChekboxForm(...elem) {
        const ul = document.createElement("ul");
        ul.classList.add("properties-value");
        for (let i = 1; i <= elem.length; i++) {
            const li = document.createElement("li");
            li.innerHTML = `
                <label>
                    <input type="checkbox" value=${elem[i - 1].slice(-4)}>
                    ${elem[i - 1].slice(0, -4)}
                </label>
            `;
            ul.appendChild(li);
        }
        document
            .querySelector(".template ol")
            .lastElementChild.insertBefore(
                ul,
                document.querySelector(".add-prop-to-template")
            );
    }

    function removeClass(item, itemClass) {
        if (item.classList.contains(itemClass)) {
            item.classList.remove(itemClass);
        }
    }

    function removePropertiesValueForm() {
        const valueBlock = document.querySelector(".properties-value");
        const addProp = document.querySelector(".add-prop-to-template");

        if (valueBlock) {
            valueBlock.remove();
            removeClass(addProp, "warn");
        } else {
            removeClass(addProp, "warn");
        }
    }

    function getValue(elem, codeWithText = true) {
        if (codeWithText) {
            if (elem.nodeName === "SELECT") {
                return elem.value === ""
                    ? ""
                    : `${elem.value} ${elem.selectedOptions[0].text}`;
            } else if (
                elem.querySelectorAll(
                    'input[type="checkbox"], input[type="radio"]'
                ).length > 0
            ) {
                const checkedInputs = elem.querySelectorAll(
                    'input[type="checkbox"]:checked, input[type="radio"]:checked'
                );

                if (checkedInputs.length === 1) {
                    return `${
                        checkedInputs[0].value
                    } ${checkedInputs[0].parentNode.textContent.trim()}`;
                } else {
                    return Array.from(checkedInputs)
                        .map(
                            (item) =>
                                `${
                                    item.value
                                } ${item.parentNode.textContent.trim()}`
                        )
                        .join(", ");
                }
            } else {
                return Number(elem.value.replace(",", "."));
            }
        } else {
            if (elem.nodeName === "SELECT") {
                return elem.value === "" ? "" : +elem.value;
            } else if (
                elem.querySelectorAll(
                    'input[type="checkbox"], input[type="radio"]'
                ).length > 0
            ) {
                const checkedInputs = elem.querySelectorAll(
                    'input[type="checkbox"]:checked, input[type="radio"]:checked'
                );

                if (checkedInputs.length === 1) {
                    if (checkedInputs[0].value === "True") {
                        return true;
                    } else if (checkedInputs[0].value > 1) {
                        return +checkedInputs[0].value;
                    } else {
                        return false;
                    }
                } else if (checkedInputs.length > 1) {
                    return Array.from(checkedInputs).map((item) => +item.value);
                } else {
                    return "";
                }
            } else {
                return Number(elem.value.replace(",", "."));
            }
        }
    }

    function switchProps(item) {
        switch (item.value) {
            case "5261": // Бабочка
                removePropertiesValueForm();
                createBoolean();
                break;
            case "5188": // Вариативность цвета
                removePropertiesValueForm();
                createSelect("V18934", "V28858", "V38859", "V48860");
                break;
            case "5242": // Влагопоглощаемость
                removePropertiesValueForm();
                createSelect(
                    "Группа BIa – влагопоглощение – Eb ≤ 0,5%9359",
                    "Группа BIb – влагопоглощение 0,5% < Eb ≤ 3%9360",
                    "Группа BIIa – влагопоглощение 3% < Eb ≤ 6%9361",
                    "Группа BIIb – влагопоглощение 6% < Eb ≤ 10%9362",
                    "Группа BIII – влагопоглощение Eb > 10%9363"
                );
                break;
            case "5074": // Износостойкость PEI
                removePropertiesValueForm();
                createSelect(
                    "08283",
                    "18284",
                    "28285",
                    "38286",
                    "48287",
                    "58288"
                );
                break;
            case "4933": // Количество цветов
                removePropertiesValueForm();
                createChekboxForm(" Моноколор8052", " Микс8054");
                break;
            case "4286": // Материал
                removePropertiesValueForm();
                createSelect(
                    "Керамика6351",
                    "Керамогранит6352",
                    "Клинкер6353",
                    "Камень6354",
                    "Стекло6355",
                    "Перламутр6648",
                    "Дерево6649",
                    "Эклектика6650",
                    "Мрамор6651",
                    "Травертин7036",
                    "Оникс8092",
                    "Лаймстоун8093",
                    "Бетон8109",
                    "Гипс8110",
                    "Бамбук8130",
                    "Металл8131",
                    "Латунь8155"
                );
                break;
            case "4935": // Микс
                removePropertiesValueForm();
                createBoolean();
                break;
            case "4293": // Морозоустойчивость
                removePropertiesValueForm();
                createBoolean();
                break;
            case "4284": // Обработка
                removePropertiesValueForm();
                createChekboxForm(
                    " структурированная6347",
                    " натуральная6345",
                    " лапатированная6344",
                    " состаренная8001",
                    " патинированная6348",
                    " полированная6343",
                    " ректифицированная6346",
                    " сатинированная7124",
                    " Lux7931"
                );
                break;
            case "4283": // Отражение поверхности
                removePropertiesValueForm();
                createSelect(
                    "Глянцевая6340",
                    "Матовая6341",
                    "Полуматовая8055",
                    "Не матовая/не глянцевая6342",
                    "Матовая / глянцевая9934",
                    "Полуполированная9992"
                );
                break;
            case "4285": // Покрытие
                removePropertiesValueForm();
                createSelect(
                    "Глазурованная6349",
                    "Неглазурованная6350",
                    "Sugar эффект8096"
                );
                break;
            case "4950": // Противоскользящая
                removePropertiesValueForm();
                createBoolean();
                break;
            case "5346": // С капиносом
                removePropertiesValueForm();
                createBoolean();
                break;
            case "5073": // Сопротивление скольжению
                removePropertiesValueForm();
                createSelect(
                    "R 98278",
                    "R 108279",
                    "R 118280",
                    "R 128281",
                    "R 138282"
                );
                break;
            case "4934": // Тип скрепления
                removePropertiesValueForm();
                createChekboxForm(
                    " на сетке8053",
                    " на полимерной сцепке8075",
                    " на бумаге8090"
                );
                break;
            case "5377": // Тональная вариация
                removePropertiesValueForm();
                createSelect(
                    "выраженная9929",
                    "минимальная9930",
                    "не определена9931",
                    "отсутствует9932",
                    "сильная9933"
                );
                break;
            case "5381": // Устойчивость к образованию пятен
                removePropertiesValueForm();
                createSelect(
                    "Класс 19935",
                    "Класс 29936",
                    "Класс 39937",
                    "Класс 49938",
                    "Класс 59939"
                );
                break;
            case "4929": // Форма чипа у мозаики
                removePropertiesValueForm();
                createChekboxForm(
                    " арабески / фигурная8056",
                    " восьмиугольник / octogonal8048",
                    " другая8051",
                    " квадрат8046",
                    " овал/круг8050",
                    " прямоугольник8045",
                    " ромб8049",
                    " шестиугольник / hexagonal8047",
                    " треугольник8058"
                );
                break;
            case "4928": // Чипы разного размера у мозаики
                removePropertiesValueForm();
                createBoolean();
                break;
            case "": // ---------
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
            if (elem.nodeName === "SELECT") {
                return `${elem.value} ${elem.selectedOptions[0].text}`;
            } else if (
                elem.querySelectorAll(
                    'input[type="checkbox"], input[type="radio"]'
                ).length > 0
            ) {
                // Ищем либо чекбоксы, либо радиокнопки
                const checkedInputs = elem.querySelectorAll(
                    'input[type="checkbox"]:checked, input[type="radio"]:checked'
                );

                if (checkedInputs.length === 1) {
                    return `${
                        checkedInputs[0].value
                    } ${checkedInputs[0].parentNode.textContent.trim()}`;
                } else {
                    return Array.from(checkedInputs)
                        .map(
                            (item) =>
                                `${
                                    item.value
                                } ${item.parentNode.textContent.trim()}`
                        )
                        .join(", ");
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

        listOfPropsFromTemp.forEach((prop) => {
            // getting the names of the properties to be added
            if (!allPropsOnPage.includes(prop)) {
                // check for no matches
                filteredPropList.push(+prop); // if the condition is true, then adding to the array as a number
            }
        });
        // here an object is formed and returned in which the necessary property and its value are added
        return filteredPropList.reduce((acc, prop) => {
            if (Object.prototype.hasOwnProperty.call(proplistInTemp, prop)) {
                acc[prop] = proplistInTemp[prop];
            }
            return acc;
        }, {});
    }

    function addingPropListToTemplate() {
        const newPropListItem = document.createElement("li"),
            delFromTemplate = document.createElement("button"),
            templateOl = document.querySelector(".template ol"),
            propList = document.querySelector('[name="properties-list"]'),
            propValueBlock = document.querySelector(".properties-value");
        let propValue = "";
        let propValueOnlyCode = "";
        const receivedValue = getValue(propValueBlock);

        if (!receivedValue || receivedValue < 0) {
            propValue = "";
            propValueOnlyCode = "";
        } else {
            propValue = getValue(propValueBlock);
            propValueOnlyCode = getValue(propValueBlock, false);
        }

        if (propList.value !== "" && !(propList.value in proplistInTemp)) {
            newPropListItem.textContent = `${propList.value} ${propList.selectedOptions[0].text} : ${propValue}`;
            delFromTemplate.textContent = "Удалить";
            delFromTemplate.classList.add("delFromTemplate");

            newPropListItem.appendChild(delFromTemplate);
            templateOl.insertBefore(
                newPropListItem,
                templateOl.lastElementChild
            );

            if (
                document
                    .querySelector(".add-prop-to-template")
                    .classList.contains("warn")
            ) {
                document
                    .querySelector(".add-prop-to-template")
                    .classList.remove("warn");
            }

            proplistInTemp[propList.value] = propValueOnlyCode;
            savePropTempToLocalStorage("propTemplate", proplistInTemp);
            console.log(proplistInTemp);
        } else {
            document
                .querySelector(".add-prop-to-template")
                .classList.add("warn");
        }
    }

    function addPropToPage(code) {
        const addNewFormBtn = Array.from(
            document.querySelectorAll("strong")
        ).filter((el) =>
            el.textContent.includes("Добавить еще один Свойство")
        )[0].parentElement;

        const clickEvent = new Event("click");
        addNewFormBtn.dispatchEvent(clickEvent);

        let numOfallPropsOnPage =
            document.querySelectorAll(
                '[id^="id_plumbing-attributevalue-content_type-object_id-"]' +
                    '[id$="-attribute"]' +
                    ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])'
            ).length - 1;

        const prop = document.querySelector(
            "#id_plumbing-attributevalue-content_type-object_id-" +
                numOfallPropsOnPage +
                "-attribute"
        );

        const changeEvent = new Event("change");
        prop.value = code;
        prop.dispatchEvent(changeEvent);
    }

    function fillInPropValues(propCode, propValue) {
        // Получаем все свойства на странице
        const allPropsOnPage = document.querySelectorAll(
            '[id^="id_plumbing-attributevalue-content_type-object_id-"][id$="-attribute"]:not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])'
        );

        // Получаем все значения свойств на странице
        const allPropsOnPageValues = document.querySelectorAll(
            '[id^="id_plumbing-attributevalue-content_type-object_id-"][id$="-value"]:not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])'
        );

        // Находим индекс нужного свойства
        let numOfProp = 0;
        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == propCode) {
                numOfProp = i;
            }
        });

        // Получаем форму (контейнер для ввода данных)
        const form = allPropsOnPageValues[numOfProp];

        // Функция для снятия отметок с всех чекбоксов
        function uncheckCheckboxes() {
            form.querySelectorAll('input[type="checkbox"]:checked').forEach(
                (checkbox) => {
                    checkbox.checked = false; // Убираем отметку
                    checkbox.dispatchEvent(new Event("change")); // Генерируем событие изменения
                }
            );
        }

        // Заполняем значение свойства, если оно не пустое
        if (propValue !== "") {
            if (
                form &&
                form.querySelector(
                    'input[type="radio"], input[type="checkbox"]'
                )
            ) {
                // Если это радиокнопки (Да/Нет)
                if (form.querySelector('input[type="radio"]')) {
                    const inputs = form.querySelectorAll('input[type="radio"]');
                    if (propValue === true) {
                        inputs[0].checked = true; // Устанавливаем "Да"
                    } else {
                        inputs[1].checked = true; // Устанавливаем "Нет"
                    }
                    // Генерируем событие изменения
                    inputs.forEach((input) =>
                        input.dispatchEvent(new Event("change"))
                    );
                } else {
                    // Если это чекбоксы (множественный выбор)
                    if (Array.isArray(propValue)) {
                        uncheckCheckboxes(); // Сначала снимаем выделение
                        propValue.forEach((value) => {
                            let checkbox = form.querySelector(
                                `input[type="checkbox"][value="${value}"]`
                            );
                            if (checkbox) {
                                checkbox.checked = true; // Выбираем нужные чекбоксы
                                checkbox.dispatchEvent(new Event("change"));
                            }
                        });
                    } else {
                        uncheckCheckboxes(); // Сначала снимаем выделение
                        let checkbox = form.querySelector(
                            `input[type="checkbox"][value="${propValue}"]`
                        );
                        if (checkbox) {
                            checkbox.checked = true; // Выбираем один чекбокс
                            checkbox.dispatchEvent(new Event("change"));
                        }
                    }
                }
            } else {
                // Если это обычное поле ввода (числа, текст)
                const changeEvent = new Event("change");
                if (
                    form &&
                    Number(form.value.replace(",", ".")) !== +propValue
                ) {
                    form.value = propValue; // Устанавливаем значение
                    form.dispatchEvent(changeEvent); // Генерируем событие изменения
                }
            }
        }
    }

    function calculateTileArea() {
        const length = document.querySelector("#id_length");
        const width = document.querySelector("#id_width");

        const allPropsOnPage = document.querySelectorAll(
            // getting all properties on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property id
                '[id$="-attribute"]' + // trailing part of the property id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])' // not a property
        );
        const allPropsOnPageValues = document.querySelectorAll(
            // getting all property values on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property values id
                '[id$="-value"]' + // trailing part of the property values id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])' // not a property value
        );

        let numOfProp = 0; // number in order on a page
        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == 4362) {
                numOfProp = i;
            }
        });

        const form = allPropsOnPageValues[numOfProp];

        const changeEvent = new Event("change");
        let unroundedNum = 0;

        if (form) {
            unroundedNum = (length.value / 100) * (width.value / 100);
            form.value = Number(unroundedNum.toFixed(3) * 100) / 100;
            form.dispatchEvent(changeEvent);
        }
    }

    function calculateM2InBox() {
        const allPropsOnPage = document.querySelectorAll(
            // getting all properties on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property id
                '[id$="-attribute"]' + // trailing part of the property id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])' // not a property
        );
        const allPropsOnPageValues = document.querySelectorAll(
            // getting all property values on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property values id
                '[id$="-value"]' + // trailing part of the property values id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])' // not a property value
        );

        let numOfm2 = 0;
        let numOfArea = 0;
        let numOfAmount = 0;
        let numOfM2InPallet = 0;
        let numOfAmountOfBoxes = 0;

        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == 4289) {
                numOfm2 = i;
            }
            if (prop.value == 4362) {
                numOfArea = i;
            }
            if (prop.value == 4288) {
                numOfAmount = i;
            }
            if (prop.value == 4356) {
                numOfM2InPallet = i;
            }
            if (prop.value == 4947) {
                numOfAmountOfBoxes = i;
            }
        });

        const formM2 = allPropsOnPageValues[numOfm2];
        const formOfArea = allPropsOnPageValues[numOfArea];
        const formOfTileInBoxes = allPropsOnPageValues[numOfAmount];
        const formOfM2InPallet = allPropsOnPageValues[numOfM2InPallet];
        const formBoxesInPallet = allPropsOnPageValues[numOfAmountOfBoxes];

        if (formM2) {
            const tileArea = Number(formOfArea.value.replace(",", "."));
            const amountInBox = Number(
                formOfTileInBoxes.value.replace(",", ".")
            );
            const m2InPallet = Number(formOfM2InPallet.value.replace(",", "."));
            const boxesInpallet = Number(
                formBoxesInPallet.value.replace(",", ".")
            );
            const changeEvent = new Event("change");

            if (
                tileArea &&
                amountInBox &&
                tileArea !== "" &&
                amountInBox !== ""
            ) {
                // setting the value of m2 in a box
                formM2.value = Math.ceil(amountInBox * tileArea * 100) / 100;
                formM2.dispatchEvent(changeEvent);
            } else if (
                m2InPallet &&
                boxesInpallet &&
                m2InPallet !== "" &&
                boxesInpallet !== ""
            ) {
                formM2.value =
                    Math.ceil((m2InPallet / boxesInpallet) * 100) / 100;
                formM2.dispatchEvent(changeEvent);
            }
        }
    }

    function calculateTilesInBox() {
        const allPropsOnPage = document.querySelectorAll(
            // getting all properties on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property id
                '[id$="-attribute"]' + // trailing part of the property id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])' // not a property
        );
        const allPropsOnPageValues = document.querySelectorAll(
            // getting all property values on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property values id
                '[id$="-value"]' + // trailing part of the property values id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])' // not a property value
        );

        let numOfAmount = 0;
        let numOfBoxWeight = 0;
        let numOfTileWeight = 0;

        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == 4288) {
                numOfAmount = i;
            }
            if (prop.value == 4357) {
                numOfBoxWeight = i;
            }
            if (prop.value == 4354) {
                numOfTileWeight = i;
            }
        });

        const formOfTileInBoxes = allPropsOnPageValues[numOfAmount];
        const formOfBoxWeight = allPropsOnPageValues[numOfBoxWeight];
        const formTileWeight = allPropsOnPageValues[numOfTileWeight];

        if (formOfTileInBoxes) {
            const boxWeight = Number(formOfBoxWeight.value.replace(",", "."));
            const tileWeight = Number(formTileWeight.value.replace(",", "."));

            const changeEvent = new Event("change");

            if (
                boxWeight &&
                tileWeight &&
                boxWeight !== "" &&
                tileWeight !== ""
            ) {
                // setting the value of amount of tiles in a box
                formOfTileInBoxes.value =
                    Math.ceil((boxWeight / tileWeight) * 100) / 100;
                formOfTileInBoxes.dispatchEvent(changeEvent);
            }
        }
    }

    function calculateWeightOfBox() {
        const allPropsOnPage = document.querySelectorAll(
            // getting all properties on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property id
                '[id$="-attribute"]' + // trailing part of the property id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])' // not a property
        );
        const allPropsOnPageValues = document.querySelectorAll(
            // getting all property values on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property values id
                '[id$="-value"]' + // trailing part of the property values id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])' // not a property value
        );

        let numOfBoxWeight = 0;
        let numOfAmountInBox = 0;
        let numOfTileWeight = 0;
        let numOfWeightM2 = 0;
        let numOfM2InBox = 0;
        let numOfWeightOfPallet = 0;
        let numOfBoxesInPallet = 0;

        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == 4357) {
                numOfBoxWeight = i;
            }
            if (prop.value == 4288) {
                numOfAmountInBox = i;
            }
            if (prop.value == 4354) {
                numOfTileWeight = i;
            }
            if (prop.value == 4355) {
                numOfWeightM2 = i;
            }
            if (prop.value == 4289) {
                numOfM2InBox = i;
            }
            if (prop.value == 5277) {
                numOfWeightOfPallet = i;
            }
            if (prop.value == 4947) {
                numOfBoxesInPallet = i;
            }
        });

        const formOfBoxWeight = allPropsOnPageValues[numOfBoxWeight];
        const formTileWeight = allPropsOnPageValues[numOfTileWeight];
        const formOfAmountInBox = allPropsOnPageValues[numOfAmountInBox];
        const formOfM2Weight = allPropsOnPageValues[numOfWeightM2];
        const formOfM2InBox = allPropsOnPageValues[numOfM2InBox];
        const formOfWeightOfPallet = allPropsOnPageValues[numOfWeightOfPallet];
        const formOfBoxesInPallet = allPropsOnPageValues[numOfBoxesInPallet];

        const changeEvent = new Event("change");

        if (formOfBoxWeight) {
            const amountInBox = Number(
                formOfAmountInBox.value.replace(",", ".")
            );
            const m2Weight = Number(formOfM2Weight.value.replace(",", "."));
            const tileWeight = Number(formTileWeight.value.replace(",", "."));
            const m2InBox = Number(formOfM2InBox.value.replace(",", "."));
            const WeightOfPallet = Number(
                formOfWeightOfPallet.value.replace(",", ".")
            );
            const boxesInPallet = Number(
                formOfBoxesInPallet.value.replace(",", ".")
            );

            if (m2Weight && m2InBox && m2Weight !== "" && m2InBox !== "") {
                formOfBoxWeight.value =
                    Math.ceil(m2Weight * m2InBox * 100) / 100;
                formOfBoxWeight.dispatchEvent(changeEvent);
            } else if (
                tileWeight &&
                amountInBox &&
                tileWeight !== "" &&
                amountInBox !== ""
            ) {
                formOfBoxWeight.value =
                    Math.ceil(tileWeight * amountInBox * 100) / 100;
                formOfBoxWeight.dispatchEvent(changeEvent);
            } else if (
                WeightOfPallet &&
                boxesInPallet &&
                WeightOfPallet !== "" &&
                boxesInPallet !== ""
            ) {
                formOfBoxWeight.value =
                    Math.ceil((WeightOfPallet / boxesInPallet) * 100) / 100;
                formOfBoxWeight.dispatchEvent(changeEvent);
            }
        }
    }

    function calculateWeightOfTile() {
        const allPropsOnPage = document.querySelectorAll(
            // getting all properties on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property id
                '[id$="-attribute"]' + // trailing part of the property id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])' // not a property
        );
        const allPropsOnPageValues = document.querySelectorAll(
            // getting all property values on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property values id
                '[id$="-value"]' + // trailing part of the property values id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])' // not a property value
        );

        let numOfTileWeight = 0;
        let numOfBoxWeight = 0;
        let numOfAmountInBox = 0;
        // let numOfWeightM2 = 0;
        // let numOfM2InBox = 0;

        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == 4354) {
                numOfTileWeight = i;
            }
            if (prop.value == 4357) {
                numOfBoxWeight = i;
            }
            if (prop.value == 4288) {
                numOfAmountInBox = i;
            }
            // if (prop.value == 4355) {
            //   numOfWeightM2 = i;
            // }
            // if (prop.value == 4289) {
            //   numOfM2InBox = i;
            // }
        });

        const formTileWeight = allPropsOnPageValues[numOfTileWeight];
        const formOfBoxWeight = allPropsOnPageValues[numOfBoxWeight];
        const formOfAmountInBox = allPropsOnPageValues[numOfAmountInBox];
        // const formOfM2Weight = allPropsOnPageValues[numOfWeightM2];
        // const formOfM2InBox = allPropsOnPageValues[numOfM2InBox];

        const changeEvent = new Event("change");

        if (formTileWeight) {
            const boxWeight = Number(formOfBoxWeight.value.replace(",", "."));
            const amountInBox = Number(
                formOfAmountInBox.value.replace(",", ".")
            );
            // const m2Weight = Number(formOfM2Weight.value.replace(",", "."));
            // const m2InBox = Number(formOfM2InBox.value.replace(",", "."));

            if (
                boxWeight &&
                amountInBox &&
                boxWeight !== "" &&
                amountInBox !== ""
            ) {
                formTileWeight.value =
                    Math.ceil((boxWeight / amountInBox) * 100) / 100;
                formTileWeight.dispatchEvent(changeEvent);
            }
        }
    }

    function calculateWeightOfTileM2() {
        const allPropsOnPage = document.querySelectorAll(
            // getting all properties on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property id
                '[id$="-attribute"]' + // trailing part of the property id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])' // not a property
        );
        const allPropsOnPageValues = document.querySelectorAll(
            // getting all property values on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property values id
                '[id$="-value"]' + // trailing part of the property values id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])' // not a property value
        );

        let numOfM2Weight = 0;
        let numOfBoxWeight = 0;
        let numOfM2InBox = 0;

        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == 4355) {
                numOfM2Weight = i;
            }
            if (prop.value == 4357) {
                numOfBoxWeight = i;
            }
            if (prop.value == 4289) {
                numOfM2InBox = i;
            }
        });

        const formM2Weight = allPropsOnPageValues[numOfM2Weight];
        const formOfBoxWeight = allPropsOnPageValues[numOfBoxWeight];
        const formOfM2InBox = allPropsOnPageValues[numOfM2InBox];

        const changeEvent = new Event("change");

        if (formM2Weight) {
            const boxWeight = Number(formOfBoxWeight.value.replace(",", "."));
            const m2InBox = Number(formOfM2InBox.value.replace(",", "."));

            formM2Weight.value = Math.ceil((boxWeight / m2InBox) * 100) / 100;
            formM2Weight.dispatchEvent(changeEvent);
        }
    }

    function calculateM2InPallet() {
        const allPropsOnPage = document.querySelectorAll(
            // getting all properties on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property id
                '[id$="-attribute"]' + // trailing part of the property id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])' // not a property
        );
        const allPropsOnPageValues = document.querySelectorAll(
            // getting all property values on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property values id
                '[id$="-value"]' + // trailing part of the property values id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])' // not a property value
        );

        let numOfM2InPallet = 0;
        let numOfm2InBox = 0;
        let numOfAmountOfBoxes = 0;

        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == 4356) {
                numOfM2InPallet = i;
            }
            if (prop.value == 4289) {
                numOfm2InBox = i;
            }
            if (prop.value == 4947) {
                numOfAmountOfBoxes = i;
            }
        });

        const formM2inBox = allPropsOnPageValues[numOfm2InBox];
        const formOfBoxesInPallet = allPropsOnPageValues[numOfAmountOfBoxes];
        const formOfM2InPallet = allPropsOnPageValues[numOfM2InPallet];

        if (formOfM2InPallet) {
            const m2inBox1 = Number(formM2inBox.value.replace(",", "."));
            const amountOfBoxes1 = Number(
                formOfBoxesInPallet.value.replace(",", ".")
            );
            const changeEvent1 = new Event("change");

            if (
                m2inBox1 &&
                amountOfBoxes1 &&
                m2inBox1 !== "" &&
                amountOfBoxes1 !== ""
            ) {
                // setting the value of m2 in the pallet
                formOfM2InPallet.value =
                    Math.ceil(m2inBox1 * amountOfBoxes1 * 100) / 100;
                formOfM2InPallet.dispatchEvent(changeEvent1);
            }
        }
    }

    function calculateBoxesInPallet() {
        const allPropsOnPage = document.querySelectorAll(
            // getting all properties on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property id
                '[id$="-attribute"]' + // trailing part of the property id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])' // not a property
        );
        const allPropsOnPageValues = document.querySelectorAll(
            // getting all property values on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property values id
                '[id$="-value"]' + // trailing part of the property values id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])' // not a property value
        );

        let numOfm2InBox = 0;
        let numOfWeightOfBox = 0;
        let numOfAmountOfBoxes = 0;
        let numOfM2InPallet = 0;
        let numOfWeightOfPallet = 0;

        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == 4289) {
                numOfm2InBox = i;
            }
            if (prop.value == 4357) {
                numOfWeightOfBox = i;
            }
            if (prop.value == 4947) {
                numOfAmountOfBoxes = i;
            }
            if (prop.value == 4356) {
                numOfM2InPallet = i;
            }
            if (prop.value == 5277) {
                numOfWeightOfPallet = i;
            }
        });

        const formM2inBox = allPropsOnPageValues[numOfm2InBox];
        const formOfWeightOfBox = allPropsOnPageValues[numOfWeightOfBox];
        const formOfAmountOfBoxes = allPropsOnPageValues[numOfAmountOfBoxes];
        const formOfM2InPallet = allPropsOnPageValues[numOfM2InPallet];
        const formOfWeightOfPallet = allPropsOnPageValues[numOfWeightOfPallet];

        if (
            formM2inBox &&
            formOfWeightOfBox &&
            formOfAmountOfBoxes &&
            formOfM2InPallet &&
            formOfWeightOfPallet
        ) {
            const m2inBox = Number(formM2inBox.value.replace(",", "."));
            const weightOfBox = Number(
                formOfWeightOfBox.value.replace(",", ".")
            );
            const m2InPallet = Number(formOfM2InPallet.value.replace(",", "."));
            const wightOfPallet = Number(
                formOfWeightOfPallet.value.replace(",", ".")
            );
            const changeEvent = new Event("change");

            if (m2InPallet && m2inBox && m2InPallet !== "" && m2inBox !== "") {
                // setting the value of amount of boxes in the pallet
                formOfAmountOfBoxes.value =
                    Math.ceil((m2InPallet / m2inBox) * 100) / 100;
                formOfAmountOfBoxes.dispatchEvent(changeEvent);
            } else if (
                wightOfPallet &&
                weightOfBox &&
                wightOfPallet !== "" &&
                weightOfBox !== ""
            ) {
                formOfAmountOfBoxes.value =
                    Math.ceil((wightOfPallet / weightOfBox) * 100) / 100;
                formOfAmountOfBoxes.dispatchEvent(changeEvent);
            }
        }
    }

    function calculateWeightOfPallet() {
        const allPropsOnPage = document.querySelectorAll(
            // getting all properties on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property id
                '[id$="-attribute"]' + // trailing part of the property id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-attribute"])' // not a property
        );
        const allPropsOnPageValues = document.querySelectorAll(
            // getting all property values on the page
            '[id^="id_plumbing-attributevalue-content_type-object_id-"]' + // the initial part of the property values id
                '[id$="-value"]' + // trailing part of the property values id
                ':not([id="id_plumbing-attributevalue-content_type-object_id-__prefix__-value"])' // not a property value
        );

        let numOfWeightOfBox = 0;
        let numOfAmountOfBoxes = 0;
        let numOfWeightOfPallet = 0;

        allPropsOnPage.forEach((prop, i) => {
            if (prop.value == 4357) {
                numOfWeightOfBox = i;
            }
            if (prop.value == 4947) {
                numOfAmountOfBoxes = i;
            }
            if (prop.value == 5277) {
                numOfWeightOfPallet = i;
            }
        });

        const formOfWeightOfBox = allPropsOnPageValues[numOfWeightOfBox];
        const formOfAmountOfBoxes = allPropsOnPageValues[numOfAmountOfBoxes];
        const formOfWeightOfPallet = allPropsOnPageValues[numOfWeightOfPallet];

        if (formOfWeightOfBox && formOfAmountOfBoxes && formOfWeightOfPallet) {
            const weightOfBox = Number(
                formOfWeightOfBox.value.replace(",", ".")
            );
            const amountOfBoxes = Number(
                formOfAmountOfBoxes.value.replace(",", ".")
            );
            const changeEvent = new Event("change");

            if (
                weightOfBox &&
                amountOfBoxes &&
                weightOfBox !== "" &&
                amountOfBoxes !== ""
            ) {
                // setting the value of weight in the pallet
                formOfWeightOfPallet.value =
                    Math.ceil(weightOfBox * amountOfBoxes * 100) / 100;
                formOfWeightOfPallet.dispatchEvent(changeEvent);
            }
        }
    }

    if (addProp) {
        startListener(addProp, "click", addingPropListToTemplate);
    }

    prop.addEventListener("click", (e) => {
        if (e.target.classList.contains("properties-value")) {
            document.addEventListener("keydown", handleEnterKey);
        }
    });

    ol.addEventListener("click", (e) => {
        const target = e.target;

        if (target && target.classList.contains("delFromTemplate")) {
            const valueCode = target.parentNode.textContent.slice(0, 4);

            target.parentNode.remove();
            delete proplistInTemp[valueCode];
            savePropTempToLocalStorage("propTemplate", proplistInTemp);
            saveHtmlChanges();
        }
    });

    findPropOnPage.addEventListener("click", () => {
        getFunctionResultFromPage(getPropListFromPage)
            .then(function (result) {
                missingPropsList = getMissingPropsList(result);
                savePropTempToLocalStorage("missingPropList", missingPropsList);
                console.log(missingPropsList);
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    addPropsFormOnPage.addEventListener("click", () => {
        const missingProps = Object.keys(
            getPropTempFromLocalStorage("missingPropList")
        );

        (async function () {
            for (let i = 0; i < missingProps.length; i++) {
                await getFunctionResultFromPage(addPropToPage, missingProps[i]);
            }
        })();
    });

    addPropsValueOnPage.addEventListener("click", () => {
        const missingProps = Object.keys(
            getPropTempFromLocalStorage("missingPropList")
        );
        missingPropsList = getPropTempFromLocalStorage("missingPropList");

        (async function () {
            for (let i = 0; i < missingProps.length; i++) {
                const propCode = missingProps[i];
                const propValueCode = missingPropsList[missingProps[i]];
                await getFunctionResultFromPage(
                    fillInPropValues,
                    propCode,
                    propValueCode
                );
            }
        })();
    });

    changeAllPropsOnPage.addEventListener("click", () => {
        proplistInTemp = getPropTempFromLocalStorage("propTemplate");
        const propListFromTemp = Object.keys(proplistInTemp);

        (async function () {
            for (let i = 0; i < propListFromTemp.length; i++) {
                const propCode = propListFromTemp[i];
                const propValueCode = proplistInTemp[propListFromTemp[i]];
                await getFunctionResultFromPage(
                    fillInPropValues,
                    propCode,
                    propValueCode
                );
            }
        })();
    });

    calcAreaBtn.addEventListener("click", () => {
        useFunctionsOnPage(calculateTileArea);
    });

    calcM2Btn.addEventListener("click", () => {
        useFunctionsOnPage(calculateM2InBox);
    });

    calcTileWeightBtn.addEventListener("click", () => {
        useFunctionsOnPage(calculateWeightOfTile);
    });

    calcM2WeightBtn.addEventListener("click", () => {
        useFunctionsOnPage(calculateWeightOfTileM2);
    });

    calcBoxesInPalletBtn.addEventListener("click", () => {
        useFunctionsOnPage(calculateBoxesInPallet);
    });

    calcM2InPalletBtn.addEventListener("click", () => {
        useFunctionsOnPage(calculateM2InPallet);
    });

    calcWeightInPalletBtn.addEventListener("click", () => {
        useFunctionsOnPage(calculateWeightOfPallet);
    });

    calcWeightInBox.addEventListener("click", () => {
        useFunctionsOnPage(calculateWeightOfBox);
    });

    calcTilesInBox.addEventListener("click", () => {
        useFunctionsOnPage(calculateTilesInBox);
    });
};

export default properties;
