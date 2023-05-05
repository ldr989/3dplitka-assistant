import hideElement from './hide-element.js';
import showElement from './show-element.js';

function header(firstTabSelector, secondTabSelector, firstTabContentSelector, secondTabContentSelector) {
    const workWithImages = document.querySelector(firstTabSelector),
        workWithProperties = document.querySelector(secondTabSelector),
        properties = document.querySelector(firstTabContentSelector),
        images = document.querySelector(secondTabContentSelector);


    workWithImages.addEventListener('click', (e) => {
        hideElement(properties);
        showElement(images);
    });

    workWithProperties.addEventListener('click', (e) => {
        hideElement(images);
        showElement(properties);
    });
}

export default header;