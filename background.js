console.log("Background.js loaded");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "classifyTexts") {
    const texts = request.texts;
    console.log("request.texts: (inside background.js)", request.texts);
    makePrediction(texts, sendResponse);
    return true; // To indicate asynchronous response
  }
});

async function makePrediction(texts, sendResponse) {
  try {
    const apiUrl = "http://localhost:5000/check-texts";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texts: texts }),
    });
    // Log the response to see its content
    console.log("Response from server:", response);

    const data = await response.json(); // Parse the JSON response
    console.log("Data received from server:", data);

    // Send the classification results to the popup script
    chrome.runtime.sendMessage({
      action: "classificationResult",
      classification: data,
    });
  } catch (error) {
    console.error("Error making prediction:", error);
    sendResponse(null);
  }
}
//     .then((response) => response.json())
//     .then((classification) => {
//       // Send the classification results to the popup script
//       chrome.runtime.sendMessage({
//         action: "classificationResult",
//         classification,
//       });
//     })

//     .catch((error) => console.error("Error:", error));
// } catch (error) {
//   console.error("Error making prediction:", error);
//   sendResponse(null);
// }
// if (request.action === "detectTexts") {
//   // Forward message to content script to get texts
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(
//       tabs[0].id,
//       { action: "detectTexts" },
//       function (response) {
//         sendResponse(response); // Send the response back to the popup.js
//       }
//     );
//   });
//   return true; // To indicate asynchronous response
// }
// else
//   if (response.ok) {
//     const data = await response.json();
//     console.log("Data: (inside background.js)", data);
//     sendResponse(data);
//   } else {
//     console.error("Request failed with status:", response.status);
//     sendResponse(null);
//   }
// } catch (error) {
//   console.error("Error making prediction:", error);
//   sendResponse(null);
// }
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "classifyTexts") {
//     makePrediction(request.texts, sendResponse);
//     return true; // To indicate asynchronous response
//   }
// });console.log("Background.js loaded");
// console.log("Background.js loaded");
