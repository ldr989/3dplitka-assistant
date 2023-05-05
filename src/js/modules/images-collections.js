import useFunctionsOnPage from "./use-functions-on-page.js";
import useFunctionsOnPageSeveralTimes from "./use-function-on-page-several-times.js";


function imagesCollections(addNewCollImage, inputSelector, autoClick) {
    const addNewImage = document.querySelector(addNewCollImage);

    addNewImage.addEventListener('click', () => {
        // useFunctionsOnPage(openCollForm);
        useFunctionsOnPageSeveralTimes(autoClick, document.querySelector(inputSelector).value);
    });
}

export default imagesCollections;