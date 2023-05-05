function showElement(element) {
    if (element.classList.contains('hide')) {
        element.classList.add('show');
        element.classList.remove('hide');
    }
}

export default showElement;