function openForm(formSelector) {
    const grp = document.querySelector(formSelector);
    if (grp.classList.contains('grp-closed')) {
        grp.classList.add('grp-open');
        grp.classList.remove('grp-closed');
    }
}
export default openForm;