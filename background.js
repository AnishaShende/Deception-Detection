console.log("Background.js loaded");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "classifyTexts") {
    const texts = request.texts;
    console.log("request.texts: (inside background.jss)", request.texts);
    makePrediction(texts, sender.tab.id, sendResponse);
    return true; // To indicate asynchronous response
  }
});

async function makePrediction(texts, tabId, sendResponse) {
  try {
    const apiUrl = "http://localhost:5000/check-texts";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texts: texts }),
    });
    if (!response.ok) {
      console.log("Response not OK:", response);
      throw new Error("Response not OK");
    }

    const classification = await response.json();
    console.log("Data received from server:", classification);

    // Send the classification results to the content script
    chrome.tabs.sendMessage(tabId, {
      action: "classificationResult",
      classification: classification,
    });
    // Send the classification results to the popup script
    // chrome.runtime.sendMessage({
    //   action: "classificationResult",
    //   classification: classification,
    // });
  } catch (error) {
    console.error("Error making prediction:", error);
    sendResponse(null);
  }
}
