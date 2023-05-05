import useFunctionsOnPage from './use-functions-on-page.js';
import useFunctionsOnPageSeveralTimes from './use-function-on-page-several-times.js';
import changeImageTypeToFaces from './change-to-faces.js';

function imagesTiles(tileAddFormSelector, inputSelector, addFacesSelector, autoClick, openTileForm) {
    const addNewTileImage = document.querySelector(tileAddFormSelector),
        addNewTileFace = document.querySelector(addFacesSelector);

    try {
        addNewTileImage.addEventListener('click', (e) => {
            // По нажатию кнопки создается указанное колличество полей для загрузки изображений
            useFunctionsOnPage(openTileForm);
            useFunctionsOnPageSeveralTimes(autoClick, document.querySelector(inputSelector).value);
        });
    } catch (error) {
        console.log(error);
    }

    try {
        addNewTileFace.addEventListener('click', () => {
            // После нажатия меняет тип изображения на лица, во всех формах
            useFunctionsOnPage(openTileForm);
            useFunctionsOnPageSeveralTimes(autoClick, document.querySelector(inputSelector).value);
            useFunctionsOnPage(changeImageTypeToFaces);
        });
    } catch (error) {
        console.log(error);
    }
}
export default imagesTiles;