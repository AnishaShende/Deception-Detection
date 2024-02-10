// content.js
console.log("Content.js loaded");
function getTextsFromPage() {
  const texts = Array.from(document.querySelectorAll("*"))
    .map((element) => (element.innerText ? element.innerText.trim() : ""))
    // .map((element) => element.innerText.trim())
    .filter((text) => text.length > 0);
  console.log("getTextsFromPage:", texts);
  return texts;
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
