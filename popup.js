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

  document
    .getElementById("detectButton")
    .addEventListener("click", async function () {
      // Show loading animation
      document.getElementById("loading").style.display = "block";

      // Send message to background script to get texts
      chrome.runtime.sendMessage({ action: "detectTexts" });
    });
});
function highlightDeceptiveTexts(predictions) {
  predictions.forEach((prediction) => {
    if (prediction.prediction[0].label === "Dark_Pattern") {
      const text = prediction.text;
      console.log("Highlighting dark pattern text:", text);

      // const elements = document.querySelectorAll("*");
      // elements.forEach((element) => {
      //   if (element.innerText.includes(text)) {
      //     element.style.backgroundColor = "yellow";
      //   }
      // });

      // Find all elements containing the deceptive text and highlight them
      document.querySelectorAll("*").forEach((element) => {
        if (element.innerText.includes(text)) {
          element.style.backgroundColor = "yellow";
        }
      });
    }
  });
  // Hide the loading animation
  document.getElementById("loading").style.display = "none";
}
