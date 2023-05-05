function autoClickBtnAll(btnSelector) {
    // Функция создает событие клика на кнопку "Добавить еще один Доп. изображение"
    const btn = document.querySelectorAll(btnSelector);
    let event = new Event("click");
    btn[3].dispatchEvent(event);
}
export default autoClickBtnAll;