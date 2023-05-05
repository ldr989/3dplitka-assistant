function autoClickBtn(btnSelector) {
    // Функция создает событие клика на кнопку "Добавить еще один Доп. изображение"
    const btn = document.querySelector(btnSelector);
    let event = new Event("click");
    btn.dispatchEvent(event);
}

export default autoClickBtn;