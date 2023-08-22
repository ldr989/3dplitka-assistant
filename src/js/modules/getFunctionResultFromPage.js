function getFunctionResultFromPage(anyFunction, ...args) {
    //Функция запускает функцию для изменения элементов на странице
    // где anyFunction это нужная функция
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true }, (tabs) => {
            const tab = tabs[0];
            if (tab) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id, allFrames: true },
                        func: anyFunction,
                        args: args
                    },
                    (result) => {
                        resolve(result[0].result);
                    }
                );
            } else {
                reject("There are no active tabs");
            }
        });
    });
}
export default getFunctionResultFromPage;