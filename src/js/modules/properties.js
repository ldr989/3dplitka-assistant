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

    
    function createInput() {
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
        }
    }


    function startListener() {
        list.addEventListener('change', () => {
            if (list.value == 5261) {
                removeProperiesValueForm();
                createInput();
            } else {
                removeProperiesValueForm();
                createBoolean();
            }
        });
    }
}

export default properties;