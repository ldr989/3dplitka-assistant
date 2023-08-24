function getFunctionResultFromPage(anyFunction, ...args) {
    //Функция запускает функцию для изменения элементов на странице
    // где anyFunction это нужная функция
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true }, (tabs) => {
            const tab = tabs[0];
            if (tab) {
                setTimeout(() => { 
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
                }, 100);
            } else {
                reject(console.log('error'));
            }
        });
    });
}
export default getFunctionResultFromPage;