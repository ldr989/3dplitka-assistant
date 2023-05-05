function useFunctionsOnPageSeveralTimes(anyFunction, times) {
    // Функция запускает функцию для изменения элементов на странице указанное колличество раз
    // где anyFunction это функция и times это колличество запусков
    chrome.tabs.query({ active: true }, (tabs) => {
        const tab = tabs[0];
        if (tab) {
            for (let i = 1; i <= times; i++) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id, allFrames: true },
                        func: anyFunction
                    },
                );
            }
        } else {
            alert("There are no active tabs");
        }
    });
}
export default useFunctionsOnPageSeveralTimes;