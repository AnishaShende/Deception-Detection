document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    try {
      var urlObj = new URL(changeInfo.url);
      var url = urlObj.hostname;
      console.log("URL:", url);
      detectPhishing(url);
    } catch (error) {
      console.error("Failed to construct URL:", error);
    }
  });

  // Add event listener to the button
  document
    .getElementById("detectButton")
    .addEventListener("click", function () {
      chrome.tabs.executeScript(
        {
          code: "window.getSelection().toString();", // Get selected text
        },
        function (selection) {
          if (selection && selection[0]) {
            const text = selection[0].trim();
            if (text) {
              detectPhishingText(text);
            }
          }
        }
      );
    });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var urlObj = new URL(tabs[0].url);
    var url = urlObj.hostname;
    detectPhishing(url);
  });

  function detectPhishing(url) {
    showLoading(true);
    updateWebsite(url);
    makePrediction(url)
      .then((isPhishing) => {
        updateButton(isPhishing);
        updateWebsiteDetails(isPhishing);
        setTimeout(() => {
          updateButton(isPhishing);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error making prediction:", error);
      })
      .finally(() => {
        showLoading(false);
      });
  }

   // Function to detect phishing for given text
   function detectPhishingText(text) {
    showLoading(true);
    makePrediction(text)
      .then((likelihood) => {
        updateAccuracyText(likelihood);
      })
      .catch((error) => {
        console.error("Error making prediction:", error);
      })
      .finally(() => {
        showLoading(false);
      });
  }

  function updateButton(isPhishing) {
    var button = document.getElementById("detectButton");
    button.style.backgroundColor = "black";
    button.style.color = "white";
    if (isPhishing) {
      button.innerText = "Scam";
      button.style.backgroundColor = "red";
    } else {
      button.innerText = "Genuine!";
      button.style.backgroundColor = "green";
    }
  }

  function updateWebsite(url) {
    var websiteName = document.getElementById("website");
    websiteName.innerText = `Website: ${url}`;
  }

  function updateWebsiteDetails(isPhishing) {
    var websiteName = document.getElementById("website");
    var accuracyText = document.getElementById("accuracy-text");
    if (isPhishing) {
      websiteName.style.color = "red";
      accuracyText.style.color = "red";
    } else {
      websiteName.style.color = "green";
      accuracyText.style.color = "green";
    }
  }

  async function makePrediction(url) {
    try {
      const apiUrl = "http://127.0.0.1:5000/check-url";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });
      if (response.ok) {
        try {
          const data = await response.json();
          if ("prediction" in data) {
            const predictionLikelihood = data["prediction"];
            updateAccuracyText(predictionLikelihood);
            return parseFloat(predictionLikelihood) >= 40;
          } else {
            console.error("Invalid response format:", data);
            return false;
          }
        } catch (error) {
          console.error("Invalid JSON in response:", error);
          return false;
        }
      } else {
        console.error("Request failed with status:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Error making prediction:", error);
      return false;
    }
  }

  function updateAccuracyText(likelihood) {
    var accuracyText = document.getElementById("accuracy-text");
    accuracyText.innerText = `Likelihood: ${likelihood}`;
  }

  function showLoading(isLoading) {
    var loadingDiv = document.getElementById("loading");
    var detectButton = document.getElementById("detectButton");
    if (isLoading) {
      loadingDiv.style.display = "block";
      detectButton.disabled = true;
    } else {
      loadingDiv.style.display = "none";
      detectButton.disabled = false;
    }
  }
});

// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementById("detectButton")
//     .addEventListener("click", detectPhishing);
//   // Add event listener for tab updates
//   // Check if the tab is loading and the URL has changed
//   // Call detectPhishing function to perform phishing detection
//   // if (isPhishingWebsite(tab.url)) {
//   // Open the extension popup
//   // Call detectPhishing function to perform phishing detection
//   // chrome.action.openPopup();
//   // var urlObj = new URL(tabs[0].url);
//   // var urlObj = new URL(changeInfo.url);
//   // var url = urlObj.hostname;
//   // detectPhishing(url);
//   // const isPhishing = await makePrediction(url); // Call your API here
//   // if (isPhishing) {
//   // chrome.tabs.executeScript(tabId, {
//   //   code: `alert("Warning: This site may be a phishing site!");`,
//   // });
//   // }
//   // detectPhishing(tab.url);
//   // }
//   // if (changeInfo.status === "complete" && tab.active) {
//   // const url = tab.url;
//   // var urlObj = new URL(changeInfo.url);
//   // var url = urlObj.hostname;
//   // const isPhishing = await makePrediction(url); // Call your API here
//   // if (isPhishing) {
//   //   chrome.tabs.executeScript(tabId, {
//   //     code: `alert("Warning: This site may be a phishing site!");`,
//   //   });
//   // }
//   // }
// });

// Initial phishing detection when the popup is opened
// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   var urlObj = new URL(tabs[0].url);
//   var url = urlObj.hostname;
//   detectPhishing(url);
// });

// function detectPhishing(url) {
//   showLoading(true);

//   // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   // var url = tabs[0].url;
//   // var urlObj = new URL(tabs[0].url);
//   // var url = urlObj.hostname;

//   updateWebsite(url);

//   makePrediction(url)
//     .then((isPhishing) => {
//       updateButton(isPhishing);
//       updateWebsiteDetails(isPhishing);
//       setTimeout(() => {
//         updateButton(isPhishing);
//       }, 2000);
//     })
//     .catch((error) => {
//       console.error("Error making prediction:", error);
//     })
//     .finally(() => {
//       showLoading(false);
//     });
//   // });
// }

// function updateButton(isPhishing) {
//   var button = document.getElementById("detectButton");

//   button.style.backgroundColor = "black";
//   button.style.color = "white";

//   if (isPhishing) {
//     button.innerText = "Scam";
//     button.style.backgroundColor = "red";
//   } else {
//     button.innerText = "Genuine!";
//     button.style.backgroundColor = "green";
//   }
// }
// function updateWebsite(url) {
//   var websiteName = document.getElementById("website");

//   websiteName.innerText = `Website: ${url}`;
// }

// function updateWebsiteDetails(isPhishing) {
//   var websiteName = document.getElementById("website");
//   var accuracyText = document.getElementById("accuracy-text");

//   if (isPhishing) {
//     websiteName.style.color = "red";
//     accuracyText.style.color = "red";
//   } else {
//     websiteName.style.color = "green";
//     accuracyText.style.color = "green";
//   }
// }
// async function makePrediction(url) {
//   try {
//     const apiUrl = "http://127.0.0.1:5000/check-url";
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ url: url }),
//     });
//     // console.log(response);
//     if (response.ok) {
//       try {
//         const data = await response.json();
//         // console.log(data);
//         if ("prediction" in data) {
//           const predictionLikelihood = data["prediction"];
//           updateAccuracyText(predictionLikelihood);
//           return parseFloat(predictionLikelihood) >= 40;
//         } else {
//           console.error("Invalid response format:", data);
//           return false;
//         }
//       } catch (error) {
//         console.error("Invalid JSON in response:", error);
//         return false;
//       }
//     } else {
//       console.error("Request failed with status:", response.status);
//       return false;
//     }
//   } catch (error) {
//     console.error("Error making prediction:", error);
//     return false;
//   }
// }

// function updateAccuracyText(likelihood) {
//   var accuracyText = document.getElementById("accuracy-text");
//   accuracyText.innerText = `Likelihood: ${likelihood}`;
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
