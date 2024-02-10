console.log("Background.js loaded");

// Listen for the onCompleted event and send a message to the content script
chrome.webNavigation.onCompleted.addListener(
  function (details) {
    chrome.tabs.sendMessage(
      details.tabId,
      { action: "getTexts" },
      function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log("Message sent successfully");
        }
      }
    );
  },
  { url: [{ urlMatches: "http://*/*" }, { urlMatches: "https://*/*" }] }
);

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.action === "classifyTexts") {
    const texts = request.texts;
    console.log("request.texts: (inside background.js)", request.texts);
    await makePrediction(texts, sender.tab.id, sendResponse);
    return true; // To indicate asynchronous response
  }
});

async function makePrediction(texts, tabId, sendResponse) {
  // try {
  //   const apiUrl = "http://localhost:5000/check-texts";
  //   const response = await fetch(apiUrl, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ texts: texts }),
  //   });
  //   if (!response.ok) {
  //     console.log("Response not OK:", response);
  //     throw new Error("Response not OK");
  //   }

  //   const classification = await response.json();
  //   console.log("Data received from server:", classification);

  //   // Send the classification results to the popup script
  //   chrome.runtime.sendMessage({
  //     action: "classificationResult",
  //     classification: classification,
  //   });
  // } catch (error) {
  //   console.error("Error making prediction:", error);
  //   sendResponse(null);
  // }
  try {
    const apiUrl = "http://localhost:5000/check-texts";
    for (const text of texts) {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texts: [text] }), // Send only one text at a time
      });
      if (!response.ok) {
        console.log("Response not OK:", response);
        throw new Error(`Response not OK: ${response.statusText}`);
      }

      const classification = await response.json();
      console.log("Data received from server:", classification);

      // // Send the classification result to the popup script
      // chrome.runtime.sendMessage({
      //   action: "classificationResult",
      //   classification: classification,
      // });
      // Send the classification result to the content script
      chrome.tabs.sendMessage(
        // details.tabId,
        tabId,
        {
          action: "classificationResult",
          classification: classification,
        },
        function (response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            console.log("Message sent successfully");
          }
        }
      );
    }
  } catch (error) {
    console.error("Error making prediction:", error);
    sendResponse({ error: error.message });
  }
}
