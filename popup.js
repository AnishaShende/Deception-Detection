// // popup.js
// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementById("detectButton")
//     .addEventListener("click", async function () {
//       // Show loading animation
//       document.getElementById("loading").style.display = "block";

//       // Send message to background script to get texts
//       // chrome.runtime.sendMessage(
//       //   { action: "detectTexts" },
//       //   function (response) {
//       //     console.log("response (inside popup.js) :", response);
//       //     if (response && response.texts) {
//       //       // Send texts to background script for prediction
//       //       chrome.runtime.sendMessage({
//       //         action: "classifyTexts",
//       //         texts: response.texts,
//       //       });
//       //     } else {
//       //       console.error("No texts received from content script.");
//       //     }
//       //   }
//       // );
//       chrome.runtime.onMessage.addListener(function (
//         message,
//         sender,
//         sendResponse
//       ) {
//         if (message.action === "classificationResult") {
//           const predictions = message.predictions;
//           console.log("predictions: (inside popup.js)", predictions);
//           // if (classification === "Dark_Pattern") {
//           highlightDeceptiveTexts(predictions);
//           // }
//         }
//       });
//     });
// });
document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.action === "classificationResult") {
      const predictions = message.classification;
      console.log("predictions: (inside popup.js)", predictions);
      highlightDeceptiveTexts(predictions);
    }
  });

  document.getElementById("detectButton").addEventListener("click", async function () {
    // Show loading animation
    document.getElementById("loading").style.display = "block";

    // Send message to background script to get texts
    chrome.runtime.sendMessage({ action: "detectTexts" });
  });
});
function highlightDeceptiveTexts(predictions) {
  // predictions.forEach((prediction, index) => {
  // if (prediction.label === "Dark_Pattern") {
  // Highlight deceptive text
  predictions.forEach((prediction) => {
    if (prediction.prediction[0].label === "Dark_Pattern") {
      const text = prediction.text;
      console.log("Highlighting dark pattern text:", text);
      // const elements = document.querySelectorAll("*");
      // elements[index].style.backgroundColor = "yellow";
      // You can apply any other styling or manipulation here as needed
    }
  });
}
// });
// Send message to content script to get texts
// chrome.tabs.query(
//   { active: true, currentWindow: true },
//   async function (tabs) {
//     try {
//       const response = await new Promise((resolve, reject) => {
//         // Add a timeout to ensure that the message port remains open for the response
//         const timeout = setTimeout(() => {
//           reject(
//             new Error(
//               "Timeout while waiting for response from content script"
//             )
//           );
//         }, 5000); // Adjust timeout as needed (in milliseconds)

//         chrome.tabs.sendMessage(
//           tabs[0].id,
//           { action: "detectTexts" },
//           function (response) {
//             console.log("response (inside timeout timer) :", response);
//             clearTimeout(timeout); // Clear the timeout if a response is received
//             if (chrome.runtime.lastError) {
//               reject(new Error(chrome.runtime.lastError.message));
//             } else {
//               resolve(response);
//             }
//           }
//         );
//       });

//       if (response && response.texts) {
//         // Send texts to background script for prediction
//         chrome.runtime.sendMessage(
//           { action: "classifyTexts", texts: response.texts },
//           function (predictions) {
//             console.log("predictions:", predictions);
//             // Hide loading animation
//             document.getElementById("loading").style.display = "none";

//             // Handle predictions
//             if (predictions && predictions.length > 0) {
//               highlightDeceptiveTexts(predictions);
//             } else {
//               console.error("No predictions received.");
//             }
//           }
//         );
//       } else {
//         console.error("No texts received from (inside popup.js).");
//       }
//     } catch (error) {
//       console.error(
//         "Error sending message to content script (popup.js):",
//         error
//       );
//     }
//   }
// );

// "run_at": "document_start"
