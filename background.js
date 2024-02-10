// // Background script can be used to perform actions that need to happen in the background
// // For example, you might want to maintain state or listen to events globally.

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   // if (message.action === "classifyTexts") {
//   if (request.texts) {
//     makePrediction(request.texts);
//   }
//   //   const texts = message.texts;
//   //   makePrediction(texts);
//   // }
// });

// async function makePrediction(texts) {
//   try {
//     const apiUrl = "http://localhost:5000/check-texts";
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ texts: texts }),
//     });
//     if (response.ok) {
//       const data = await response.json();
//       highlightDeceptiveTexts(data);
//     } else {
//       console.error("Request failed with status:", response.status);
//     }
//   } catch (error) {
//     console.error("Error making prediction:", error);
//   }
// }

// function highlightDeceptiveTexts(predictions) {
//   predictions.forEach((prediction, index) => {
//     if (prediction.label === "Dark_Pattern") {
//       // Highlight deceptive text
//       const elements = document.querySelectorAll("*");
//       elements[index].style.backgroundColor = "yellow";
//       // You can apply any other styling or manipulation here as needed
//     }
//   });
// }
console.log("Background.js loaded");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "classifyTexts") {
    makePrediction(request.texts, sendResponse);
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

    if (response.ok) {
      const data = await response.json();
      console.log("Data: (inside background.js)", data);
      sendResponse(data);
    } else {
      console.error("Request failed with status:", response.status);
      sendResponse(null);
    }
  } catch (error) {
    console.error("Error making prediction:", error);
    sendResponse(null);
  }
}
