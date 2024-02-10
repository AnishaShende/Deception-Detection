// content.js
console.log("Content.js loaded");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "classificationResult") {
    const predictions = message.classification;
    console.log("predictions: (inside content.js)", predictions);
    // highlightDeceptiveTexts(predictions);
    predictions.forEach(highlightDeceptiveTexts);
  }
});

function getTextsFromPage() {
  const texts = Array.from(document.querySelectorAll("*"))
    .map((element) => (element.innerText ? element.innerText.trim() : ""))
    // .map((element) => element.innerText.trim())
    .filter((text) => text.length > 0);
  console.log("getTextsFromPage:", texts);
  return texts;
}

// function highlightDeceptiveTexts(prediction) {
//   // if (prediction.prediction[0].label === "Dark_Pattern") {
//   //   const text = prediction.text;
//   //   console.log("Highlighting dark pattern text:", text);

//   //   // Find all elements containing the deceptive text and highlight them
//   //   document.querySelectorAll("*").forEach((element) => {
//   //     if (element.innerText.includes(text)) {
//   //       element.style.backgroundColor = "yellow";
//   //     }
//   //   });
//   // }
//   const text = prediction.text;
//   console.log(
//     "Highlighting text:",
//     text,
//     "Label:",
//     prediction.prediction[0].label
//   );

//   // Find all elements containing the text and highlight them
//   document.querySelectorAll("*").forEach((element) => {
//     if (element.innerText.includes(text)) {
//       element.style.backgroundColor =
//         prediction.prediction[0].label === "Dark_Pattern" ? "yellow" : "none";
//     }
//   });
// }
// function highlightDeceptiveTexts(prediction) {
//   if (prediction.prediction[0].label === "Dark_Pattern") {
//     const text = prediction.text;
//     console.log("Highlighting dark pattern text:", text);

//     // Find all elements containing the deceptive text and highlight them
//     document.querySelectorAll("*").forEach((element) => {
//       if (element.innerText.includes(text)) {
//         element.style.backgroundColor = "yellow";
//       }
//     });
//   }
// }
function highlightDeceptiveTexts(predictions) {
  predictions.forEach((prediction) => {
    if (prediction.prediction[0].label === "Dark_Pattern") {
      const text = prediction.text;
      console.log("Highlighting dark pattern text:", text);

      // Find all elements containing the deceptive text and highlight them
      document.querySelectorAll("*").forEach((element) => {
        if (element.innerText.includes(text)) {
          element.style.backgroundColor = "yellow";
        }
      });
    }
  });
}

const texts = getTextsFromPage();
chrome.runtime.sendMessage({ action: "classifyTexts", texts });
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   console.log("Message received:", message);
//   if (message.action === "classifyTexts") {
//     const texts = getTextsFromPage();
//     console.log("texts: " + texts);
//     sendResponse({ texts: texts });
//     return true; // To indicate asynchronous response
//   }
// });
