import saveHtmlChanges from "./saveHtmlChanges.js";

const startListener = function (item, event, func, selector = '.htmlContent', name = 'savedHtmlContent') {
    item.addEventListener(event, () => {
        func();
        saveHtmlChanges(selector, name);
    });
};

export default startListener;