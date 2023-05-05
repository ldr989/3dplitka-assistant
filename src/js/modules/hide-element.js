function hideElement(element) {
    if (element.classList.contains('show')) {
        element.classList.add('hide');
        element.classList.remove('show');
    }
}

export default hideElement;