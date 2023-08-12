function saveHtmlChanges(selector = '.htmlContent', name = 'savedHtmlContent') { // stores a copy of the contents of the body tag in localStorage
    const htmlContent = document.querySelector(selector).innerHTML;
    localStorage.setItem(name, htmlContent);
}

export default saveHtmlChanges;