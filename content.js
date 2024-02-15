// console.log("Content.js loaded");

function getTextsFromPage() {
  const texts = Array.from(
    document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, a")
  )
    .map((element) => (element.innerText ? element.innerText.trim() : ""))
    .filter((text) => text.length > 0);
  console.log("getTextsFromPage:", texts);
  return texts;
}

// Get texts from the page and send them to the background script for classification

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "detectTexts") {
    console.log("detectTexts action performed in popup.js");
    // TODO: Perform the text detection and prediction logic here
    const texts = getTextsFromPage();
    chrome.runtime.sendMessage({ action: "classifyTexts", texts });
  }
});

// Listen for classification results from background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Message received:", message);
  if (message.action === "classificationResult") {
    const classification = message.classification;
    console.log("classification: ", classification);
    highlightTexts(classification);
  }
});

function highlightTexts(classifications) {
  classifications.forEach((classification) => {
    if (classification.label === "Dark_Pattern") {
      const regex = new RegExp(classification.text, "gi");
      document
        .querySelectorAll("p, h1, h2, h3, h4, h5, h6, a")
        .forEach((element) => {
          const html = element.innerHTML;
          const replacedHtml = html.replace(
            regex,
            '<span style="background-color: yellow;">$&</span>'
          );
          if (html !== replacedHtml) {
            element.innerHTML = replacedHtml;
          }
        });
    }
  });
}
