function useFunctionsOnPage(anyFunction, ...args) {
    //Функция запускает функцию для изменения элементов на странице
    // где anyFunction это нужная функция
    chrome.tabs.query({ active: true }, (tabs) => {
        const tab = tabs[0];
        if (tab) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id, allFrames: true },
                    func: anyFunction,
                    args: args
                },
            );
        } else {
            alert("There are no active tabs");
        }
    });
}
export default useFunctionsOnPage;