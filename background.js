// Background script can be used to perform actions that need to happen in the background
// For example, you might want to maintain state or listen to events globally.

// If needed, you can add background script logic here.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active && changeInfo.url) {
    // //   const url = tab.url;
    // var urlObj = new URL(changeInfo.url);
    // // var urlObj = new URL(tabs[0].url);
    // var url = urlObj.hostname;
    // console.log("URL:", url);
    // const isPhishing = await makePrediction(url); // Call your API here
    // // if (isPhishing) {
    // chrome.tabs.executeScript(tabId, {
    //   code: `alert("Warning: This site may be a phishing site!");`,
    // });
    // // }
    try {
        var urlObj = new URL(changeInfo.url);
        var url = urlObj.hostname;
        console.log("URL:", url);
        const isPhishing = await makePrediction(url); // Call your API here
        // if (isPhishing) {
        chrome.tabs.executeScript(tabId, {
          code: `alert("Warning: This site may be a phishing site!");`,
        });
        // }
      } catch (error) {
        console.error("Failed to construct URL:", error);
      }
  }
});
