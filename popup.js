document.addEventListener("DOMContentLoaded", function () {
  // chrome.runtime.onMessage.addListener(function (
  //   message,
  //   sender,
  //   sendResponse
  // ) {
  //   if (message.action === "classificationResult") {
  //     const predictions = message.classification;
  //     console.log("predictions: (inside popup.js)", predictions);
  //     highlightDeceptiveTexts(predictions);
  //   }
  // });

  document
    .getElementById("detectButton")
    .addEventListener("click", async function () {
      // Show loading animation
      document.getElementById("loading").style.display = "block";

      // Send message to content script to get texts and make prediction
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "detectTexts" });
      });
      // // Send message to background script to get texts
      // chrome.runtime.sendMessage({ action: "detectTexts" });
    });
});

// Listen for classification results from content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // console.log("back to popup.js: Message received:", message);
  if (message.action === "classificationResult") {
    document.getElementById("loading").style.display = "none";
    // const predictions = message.classification;
    // console.log("predictions: (inside popup.js)", predictions);
    // displayResults(predictions);

    // Hide the loading animation
  }
});

// function displayResults(predictions) {
//   // TODO: Display the prediction results in the popup UI
// }

// function highlightDeceptiveTexts(predictions) {
//   predictions.forEach((prediction) => {
//     if (prediction.prediction[0].label === "Dark_Pattern") {
//       const text = prediction.text;
//       console.log("Highlighting dark pattern text:", text);

//       // const elements = document.querySelectorAll("*");
//       // elements.forEach((element) => {
//       //   if (element.innerText.includes(text)) {
//       //     element.style.backgroundColor = "yellow";
//       //   }
//       // });

//       // Find all elements containing the deceptive text and highlight them
//       document.querySelectorAll("*").forEach((element) => {
//         if (element.innerText.includes(text)) {
//           element.style.backgroundColor = "yellow";
//         }
//       });
//     }
//   });
// // Hide the loading animation
// document.getElementById("loading").style.display = "none";
// }
