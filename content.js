// window.onload = async () => {
//   const newurl = new URL(window.location.href);
//   const url = newurl.hostname;
//   console.log("URL:", url);
//   console.log("inside content.js");
//   const isPhishing = await makePrediction(url); // Call your API here
//   if (isPhishing) {
//     alert("Warning: This site may be a phishing site!");
//   }
// };
// window.onload = function () {
//   const button = document.getElementById("detectButton");
//   if (button) {
//     button.addEventListener("click", async function () {
//       const texts = Array.from(document.querySelectorAll("*"))
//         .map((element) => element.innerText.trim())
//         .filter((text) => text.length > 0);
//       if (texts && texts.length > 0) {
//         console.log("Inside content.js");
//         console.log("texts: " + texts);
//         chrome.runtime.sendMessage({
//           //   method: "detectDeceptiveTexts",
//           action: "classifyTexts",
//           texts: texts,
//         });
//       }
//     });
//   }
// };
// content.js
console.log("Content.js loaded");
function getTextsFromPage() {
  const texts = Array.from(document.querySelectorAll("*"))
    .map((element) => element.innerText.trim())
    .filter((text) => text.length > 0);
  console.log("getTextsFromPage:", texts);
  return texts;
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Message received:", message);
  if (message.action === "detectTexts") {
    const texts = getTextsFromPage();
    console.log("texts: " + texts);
    sendResponse({ texts: texts });
    return true; // To indicate asynchronous response
  }
});
