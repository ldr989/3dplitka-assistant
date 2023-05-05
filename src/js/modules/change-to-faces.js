function changeImageTypeToFaces() {
    // Функция меняет тип изображения на "лица плитки"
    document.querySelectorAll('select').forEach(function (select) {
        if (select.name.startsWith('plumbing-image')) {
            select.value = '60';
        }
    });
}
export default changeImageTypeToFaces;