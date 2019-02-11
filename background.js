// https://github.com/unixpickle/queue-dedup/blob/85386cd34901467d7c52e16e416bb7eda8fe0d4c/background.js

chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: 'play.google.com',
                        pathPrefix: '/music'
                    },
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.pageAction.onClicked.addListener((tab) => {
    const query = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(query, (tabs) => {
        const mainTab = tabs[0];
        chrome.tabs.executeScript(mainTab.id, { file: 'inject.js' });
    });
});