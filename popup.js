// // // popup.js
// popup.js
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("detectButton")
    .addEventListener("click", async function () {
      // Show loading animation
      document.getElementById("loading").style.display = "block";

      // Send message to content script to get texts
      chrome.tabs.query(
        { active: true, currentWindow: true },
        async function (tabs) {
          try {
            const response = await new Promise((resolve, reject) => {
              // Add a timeout to ensure that the message port remains open for the response
              const timeout = setTimeout(() => {
                reject(
                  new Error(
                    "Timeout while waiting for response from content script"
                  )
                );
              }, 5000); // Adjust timeout as needed (in milliseconds)

              chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "detectTexts" },
                function (response) {
                  console.log("response (inside timeout timer) :", response);
                  clearTimeout(timeout); // Clear the timeout if a response is received
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                  } else {
                    resolve(response);
                  }
                }
              );
            });

            if (response && response.texts) {
              // Send texts to background script for prediction
              chrome.runtime.sendMessage(
                { action: "classifyTexts", texts: response.texts },
                function (predictions) {
                  console.log("predictions:", predictions);
                  // Hide loading animation
                  document.getElementById("loading").style.display = "none";

                  // Handle predictions
                  if (predictions && predictions.length > 0) {
                    highlightDeceptiveTexts(predictions);
                  } else {
                    console.error("No predictions received.");
                  }
                }
              );
            } else {
              console.error("No texts received from (inside popup.js).");
            }
          } catch (error) {
            console.error(
              "Error sending message to content script (popup.js):",
              error
            );
          }
        }
      );
    });
});
function highlightDeceptiveTexts(predictions) {
  predictions.forEach((prediction, index) => {
    if (prediction.label === "Dark_Pattern") {
      // Highlight deceptive text
      const elements = document.querySelectorAll("*");
      elements[index].style.backgroundColor = "yellow";
      // You can apply any other styling or manipulation here as needed
    }
  });
}
// // popup.js
// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementById("detectButton")
//     .addEventListener("click", async function () {
//       // Show loading animation
//       document.getElementById("loading").style.display = "block";

//       // Send message to content script to get texts
//       chrome.tabs.query(
//         { active: true, currentWindow: true },
//         async function (tabs) {
//           try {
//             const response = await new Promise((resolve, reject) => {
//               chrome.tabs.sendMessage(
//                 tabs[0].id,
//                 { action: "detectTexts" },
//                 function (response) {
//                   if (chrome.runtime.lastError) {
//                     reject(new Error(chrome.runtime.lastError.message));
//                   } else {
//                     resolve(response);
//                   }
//                 }
//               );
//             });

//             if (response && response.texts) {
//               // Send texts to background script for prediction
//               chrome.runtime.sendMessage(
//                 { action: "classifyTexts", texts: response.texts },
//                 function (predictions) {
//                   // Hide loading animation
//                   document.getElementById("loading").style.display = "none";

//                   // Handle predictions
//                   if (predictions && predictions.length > 0) {
//                     highlightDeceptiveTexts(predictions);
//                   } else {
//                     console.error("No predictions received.");
//                   }
//                 }
//               );
//             } else {
//               console.error("No texts received from content script.");
//             }
//           } catch (error) {
//             console.error("Error sending message to content script:", error);
//           }
//         }
//       );
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementById("detectButton")
//     .addEventListener("click", async function () {
//       // Show loading animation
//       document.getElementById("loading").style.display = "block";

//       // Send message to content script to get texts
//       chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
//         chrome.tabs.sendMessage(
//           tabs[0].id,
//           { action: "detectTexts" },
//           function (response) {
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
//         console.error("No texts received from content script.");
//       }
//     } catch (error) {
//       console.error("Error sending message to content script:", error);
//     }
//   });
// });
// });
// function (response) {
//   if (chrome.runtime.lastError) {
//     console.error(chrome.runtime.lastError.message);
//   } else if (response && response.texts) {
//     // Send texts to background script for prediction
//     chrome.runtime.sendMessage(
//       { action: "classifyTexts", texts: response.texts },
//       function (predictions) {
//         // Hide loading animation
//         document.getElementById("loading").style.display = "none";

//         // Handle predictions
//         if (predictions && predictions.length > 0) {
//           highlightDeceptiveTexts(predictions);
//         } else {
//           console.error("No predictions received.");
//         }
//       }
//     );
//   } else {
//     console.error("No texts received from content script.");
//   }
// }
//         );
//       });
//     });
// });
// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("detectButton").addEventListener("click", function () {
//     chrome.runtime.sendMessage({ action: "detectTexts" });
//   });
// });

// Add event listener to the button
// document
//   .getElementById("detectButton")
//   .addEventListener("click", function () {
//     chrome.tabs.executeScript(
//       {
//         code: `Array.from(document.querySelectorAll("*")).map(element => element.innerText.trim()).filter(text => text.length > 0);`,
//       },
//       function (texts) {
//         if (texts && texts[0]) {
//           const textArray = texts[0];
//           if (textArray.length > 0) {
//             detectDeceptiveTexts(textArray);
//           }
//         }
//       }
//     );
//   });

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

// async function makePrediction(text) {
//   try {
//     const apiUrl = "http://localhost:5000/check-text";
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ text: text }),
//     });
//     if (response.ok) {
//       const data = await response.json();
//       console.log(data);
//       return data;
//     } else {
//       console.error("Request failed with status:", response.status);
//       return { prediction: "Unknown", confidence: 0 };
//     }
//   } catch (error) {
//     console.error("Error making prediction:", error);
//     return { prediction: "Unknown", confidence: 0 };
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
// });

// document.addEventListener("DOMContentLoaded", function () {
//   chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//     try {
//       var urlObj = new URL(changeInfo.url);
//       var url = urlObj.hostname;
//       console.log("URL:", url);
//       detectPhishing(url);
//     } catch (error) {
//       console.error("Failed to construct URL:", error);
//     }
//   });

//   // Add event listener to the button
//   document
//     .getElementById("detectButton")
//     .addEventListener("click", function () {
//       chrome.tabs.executeScript(
//         {
//           code: "window.getSelection().toString();", // Get selected text
//         },
//         function (selection) {
//           if (selection && selection[0]) {
//             const text = selection[0].trim();
//             if (text) {
//               detectPhishingText(text);
//             }
//           }
//         }
//       );
//     });

//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     var urlObj = new URL(tabs[0].url);
//     var url = urlObj.hostname;
//     detectPhishing(url);
//   });

//   function detectPhishing(url) {
//     showLoading(true);
//     updateWebsite(url);
//     makePrediction(url)
//       .then((isPhishing) => {
//         updateButton(isPhishing);
//         updateWebsiteDetails(isPhishing);
//         setTimeout(() => {
//           updateButton(isPhishing);
//         }, 2000);
//       })
//       .catch((error) => {
//         console.error("Error making prediction:", error);
//       })
//       .finally(() => {
//         showLoading(false);
//       });
//   }

//    // Function to detect phishing for given text
//    function detectPhishingText(text) {
//     showLoading(true);
//     makePrediction(text)
//       .then((likelihood) => {
//         updateAccuracyText(likelihood);
//       })
//       .catch((error) => {
//         console.error("Error making prediction:", error);
//       })
//       .finally(() => {
//         showLoading(false);
//       });
//   }

//   function updateButton(isPhishing) {
//     var button = document.getElementById("detectButton");
//     button.style.backgroundColor = "black";
//     button.style.color = "white";
//     if (isPhishing) {
//       button.innerText = "Scam";
//       button.style.backgroundColor = "red";
//     } else {
//       button.innerText = "Genuine!";
//       button.style.backgroundColor = "green";
//     }
//   }

//   function updateWebsite(url) {
//     var websiteName = document.getElementById("website");
//     websiteName.innerText = `Website: ${url}`;
//   }

//   function updateWebsiteDetails(isPhishing) {
//     var websiteName = document.getElementById("website");
//     var accuracyText = document.getElementById("accuracy-text");
//     if (isPhishing) {
//       websiteName.style.color = "red";
//       accuracyText.style.color = "red";
//     } else {
//       websiteName.style.color = "green";
//       accuracyText.style.color = "green";
//     }
//   }

//   async function makePrediction(url) {
//     try {
//       const apiUrl = "http://127.0.0.1:5000/check-url";
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ url: url }),
//       });
//       if (response.ok) {
//         try {
//           const data = await response.json();
//           if ("prediction" in data) {
//             const predictionLikelihood = data["prediction"];
//             updateAccuracyText(predictionLikelihood);
//             return parseFloat(predictionLikelihood) >= 40;
//           } else {
//             console.error("Invalid response format:", data);
//             return false;
//           }
//         } catch (error) {
//           console.error("Invalid JSON in response:", error);
//           return false;
//         }
//       } else {
//         console.error("Request failed with status:", response.status);
//         return false;
//       }
//     } catch (error) {
//       console.error("Error making prediction:", error);
//       return false;
//     }
//   }

//   function updateAccuracyText(likelihood) {
//     var accuracyText = document.getElementById("accuracy-text");
//     accuracyText.innerText = `Likelihood: ${likelihood}`;
//   }

//   function showLoading(isLoading) {
//     var loadingDiv = document.getElementById("loading");
//     var detectButton = document.getElementById("detectButton");
//     if (isLoading) {
//       loadingDiv.style.display = "block";
//       detectButton.disabled = true;
//     } else {
//       loadingDiv.style.display = "none";
//       detectButton.disabled = false;
//     }
//   }
// });

// // document.addEventListener("DOMContentLoaded", function () {
// //   document
// //     .getElementById("detectButton")
// //     .addEventListener("click", detectPhishing);
// //   // Add event listener for tab updates
// //   // Check if the tab is loading and the URL has changed
// //   // Call detectPhishing function to perform phishing detection
// //   // if (isPhishingWebsite(tab.url)) {
// //   // Open the extension popup
// //   // Call detectPhishing function to perform phishing detection
// //   // chrome.action.openPopup();
// //   // var urlObj = new URL(tabs[0].url);
// //   // var urlObj = new URL(changeInfo.url);
// //   // var url = urlObj.hostname;
// //   // detectPhishing(url);
// //   // const isPhishing = await makePrediction(url); // Call your API here
// //   // if (isPhishing) {
// //   // chrome.tabs.executeScript(tabId, {
// //   //   code: `alert("Warning: This site may be a phishing site!");`,
// //   // });
// //   // }
// //   // detectPhishing(tab.url);
// //   // }
// //   // if (changeInfo.status === "complete" && tab.active) {
// //   // const url = tab.url;
// //   // var urlObj = new URL(changeInfo.url);
// //   // var url = urlObj.hostname;
// //   // const isPhishing = await makePrediction(url); // Call your API here
// //   // if (isPhishing) {
// //   //   chrome.tabs.executeScript(tabId, {
// //   //     code: `alert("Warning: This site may be a phishing site!");`,
// //   //   });
// //   // }
// //   // }
// // });

// // Initial phishing detection when the popup is opened
// // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
// //   var urlObj = new URL(tabs[0].url);
// //   var url = urlObj.hostname;
// //   detectPhishing(url);
// // });

// // function detectPhishing(url) {
// //   showLoading(true);

// //   // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
// //   // var url = tabs[0].url;
// //   // var urlObj = new URL(tabs[0].url);
// //   // var url = urlObj.hostname;

// //   updateWebsite(url);

// //   makePrediction(url)
// //     .then((isPhishing) => {
// //       updateButton(isPhishing);
// //       updateWebsiteDetails(isPhishing);
// //       setTimeout(() => {
// //         updateButton(isPhishing);
// //       }, 2000);
// //     })
// //     .catch((error) => {
// //       console.error("Error making prediction:", error);
// //     })
// //     .finally(() => {
// //       showLoading(false);
// //     });
// //   // });
// // }

// // function updateButton(isPhishing) {
// //   var button = document.getElementById("detectButton");

// //   button.style.backgroundColor = "black";
// //   button.style.color = "white";

// //   if (isPhishing) {
// //     button.innerText = "Scam";
// //     button.style.backgroundColor = "red";
// //   } else {
// //     button.innerText = "Genuine!";
// //     button.style.backgroundColor = "green";
// //   }
// // }
// // function updateWebsite(url) {
// //   var websiteName = document.getElementById("website");

// //   websiteName.innerText = `Website: ${url}`;
// // }

// // function updateWebsiteDetails(isPhishing) {
// //   var websiteName = document.getElementById("website");
// //   var accuracyText = document.getElementById("accuracy-text");

// //   if (isPhishing) {
// //     websiteName.style.color = "red";
// //     accuracyText.style.color = "red";
// //   } else {
// //     websiteName.style.color = "green";
// //     accuracyText.style.color = "green";
// //   }
// // }
// // async function makePrediction(url) {
// //   try {
// //     const apiUrl = "http://127.0.0.1:5000/check-url";
// //     const response = await fetch(apiUrl, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({ url: url }),
// //     });
// //     // console.log(response);
// //     if (response.ok) {
// //       try {
// //         const data = await response.json();
// //         // console.log(data);
// //         if ("prediction" in data) {
// //           const predictionLikelihood = data["prediction"];
// //           updateAccuracyText(predictionLikelihood);
// //           return parseFloat(predictionLikelihood) >= 40;
// //         } else {
// //           console.error("Invalid response format:", data);
// //           return false;
// //         }
// //       } catch (error) {
// //         console.error("Invalid JSON in response:", error);
// //         return false;
// //       }
// //     } else {
// //       console.error("Request failed with status:", response.status);
// //       return false;
// //     }
// //   } catch (error) {
// //     console.error("Error making prediction:", error);
// //     return false;
// //   }
// // }

// // function updateAccuracyText(likelihood) {
// //   var accuracyText = document.getElementById("accuracy-text");
// //   accuracyText.innerText = `Likelihood: ${likelihood}`;
// // }

// // function showLoading(isLoading) {
// //   var loadingDiv = document.getElementById("loading");
// //   var detectButton = document.getElementById("detectButton");

// //   if (isLoading) {
// //     loadingDiv.style.display = "block";

// //     detectButton.disabled = true;
// //   } else {
// //     loadingDiv.style.display = "none";

// //     detectButton.disabled = false;
// //   }
// // }
