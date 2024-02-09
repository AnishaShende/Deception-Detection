// // Background script can be used to perform actions that need to happen in the background
// // For example, you might want to maintain state or listen to events globally.

// // If needed, you can add background script logic here.
// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete" && tab.active && changeInfo.url) {
//     // //   const url = tab.url;
//     // var urlObj = new URL(changeInfo.url);
//     // // var urlObj = new URL(tabs[0].url);
//     // var url = urlObj.hostname;
//     // console.log("URL:", url);
//     // const isPhishing = await makePrediction(url); // Call your API here
//     // // if (isPhishing) {
//     // chrome.tabs.executeScript(tabId, {
//     //   code: `alert("Warning: This site may be a phishing site!");`,
//     // });
//     // // }
//     try {
//         var urlObj = new URL(changeInfo.url);
//         var url = urlObj.hostname;
//         console.log("URL:", url);
//         const isPhishing = await makePrediction(url); // Call your API here
//         // if (isPhishing) {
//         chrome.tabs.executeScript(tabId, {
//           code: `alert("Warning: This site may be a phishing site!");`,
//         });
//         // }
//       } catch (error) {
//         console.error("Failed to construct URL:", error);
//       }
//   }
// });
// Add event listener to the button
// document.getElementById("detectButton").addEventListener("click", function () {
// chrome.tabs.executeScript(
//   {
//     code: `Array.from(document.querySelectorAll("*")).map(element => element.innerText.trim()).filter(text => text.length > 0);`,
//   },
//   function (texts) {
//     if (texts && texts[0]) {
//       console.log(texts);
//       const textArray = texts[0];
//       if (textArray.length > 0) {
//         detectDeceptiveTexts(textArray);
//       }
//     }
//   }
// );
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.method === "detectDeceptiveTexts") {
//     detectDeceptiveTexts(request.texts);
//   }
// if (message.action === "detectTexts") {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.executeScript(tabs[0].id, { file: "content.js" });
//   });
// } else if (message.action === "textsCollected") {
//   const texts = message.texts;
//   // Now you can send the collected texts to your Flask server for classification
//   console.log(texts);
// }
// });
// });
// });
// }
// });
// });
// });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // if (message.action === "classifyTexts") {
  if (request.texts) {
    makePrediction(request.texts);
  }
  //   const texts = message.texts;
  //   makePrediction(texts);
  // }
});

// async function detectDeceptiveTexts(textArray) {
//   showLoading(true);
//   const promises = textArray.map((text) => makePrediction(text));
//   try {
//     const results = await Promise.all(promises);
//     console.log(results);
//     // Process results here
//   } catch (error) {
//     console.error("Error making predictions:", error);
//   } finally {
//     showLoading(false);
//   }
// }

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
//       console.log(data);
//       // return data;
//     } else {
//       console.error("Request failed with status:", response.status);
//       // return { prediction: "Unknown", confidence: 0 };
//     }
//   } catch (error) {
//     console.error("Error making prediction:", error);
//     // return { prediction: "Unknown", confidence: 0 };
//   }
// }

// function showLoading(isLoading) {
//   var loadingDiv = document.getElementById("loading");
//   var detectButton = document.getElementById("detectButton");
//   if (isLoading) {
//     loadingDiv.style.display = "block";
//     detectButton.disabled = true;
//   } else {
//     loadingDiv.style.display = "none";
//     detectButton.disabled = false;
//   }
// }

// function highlightDeceptiveTexts(predictions) {
//   predictions.forEach((prediction, index) => {
//     if (prediction.prediction === "Deceptive") {
//       // Highlight deceptive text
//       const elements = document.querySelectorAll("*");
//       elements[index].style.backgroundColor = "yellow";
//       // You can apply any other styling or manipulation here as needed
//     }
// });
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === "detectTexts") {
//     const texts = getTextsFromPage(); // Function to get texts from the current webpage
//     makePrediction(texts);
//   }
// });

async function makePrediction(texts) {
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
      highlightDeceptiveTexts(data);
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error making prediction:", error);
  }
}

function highlightDeceptiveTexts(predictions) {
  predictions.forEach((prediction, index) => {
    if (prediction.label === "LABEL_DECEPTIVE") {
      // Highlight deceptive text
      const elements = document.querySelectorAll("*");
      elements[index].style.backgroundColor = "yellow";
      // You can apply any other styling or manipulation here as needed
    }
  });
}

// function getTextsFromPage() {
//   // Function to extract texts from the current webpage
//   const texts = Array.from(document.querySelectorAll("*"))
//     .map((element) => element.innerText.trim())
//     .filter((text) => text.length > 0);
//   return texts;
// }

// }
// });
