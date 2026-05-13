chrome.action.onClicked.addListener(() => {
  void chrome.tabs.create({
    url: chrome.runtime.getURL("src/popup/index.html"),
  });
});
