function setup() {
  var button = document.getElementById("detectButton");
  var websiteName = document.getElementById("website");
  var accuracyText = document.getElementById("accuracy-text");
  var loadingDiv = document.getElementById("loading");

  // Check if all elements exist
  if (button && websiteName && accuracyText && loadingDiv) {
    // Add your event listener
    button.addEventListener("click", detectPhishing);

    // Stop observing
    observer.disconnect();
  }
}

// Create a new MutationObserver instance
var observer = new MutationObserver(setup);

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

// Call setup initially in case the elements already exist when the script runs
setup();

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("detectButton")
    .addEventListener("click", detectPhishing);

  // function detectPhishing() {
  //   // Display loading animation
  //   showLoading(true);

  //   // Perform the necessary logic to get the current tab's URL
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     var url = tabs[0].url;

  //     // Make a request to your machine learning model API or perform in-browser prediction
  //     // Replace the following line with your actual logic
  //     makePrediction(url)
  //       .then((isPhishing) => {
  //         // Display the result in the popup
  //         displayResult(isPhishing);
  //       })
  //       .catch((error) => {
  //         console.error('Error making prediction:', error);
  //         // Display an error message in the popup
  //         displayResult(false, 'An error occurred while checking for phishing.');
  //       })
  //       .finally(() => {
  //         // Hide loading animation
  //         showLoading(false);
  //       });
  //   });
  // }

  function detectPhishing() {
    // Display loading animation
    showLoading(true);

    // Perform the necessary logic to get the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url = tabs[0].url;

      // Make a request to your machine learning model API or perform in-browser prediction
      // Replace the following line with your actual logic
      makePrediction(url)
        .then((isPhishing) => {
          // Update the button text and style based on the prediction result
          updateButton(isPhishing);
          // Update website name and accuracy text based on the prediction result
          updateWebsiteDetails(isPhishing);
        })
        .catch((error) => {
          console.error("Error making prediction:", error);
          // Display an error message in the popup
          // displayResult(false, "An error occurred while checking for phishing.");
        })
        .finally(() => {
          // Hide loading animation
          showLoading(false);
        });
    });
  }

  // Function to update the button text and style
  function updateButton(isPhishing) {
    var button = document.getElementById("detectButton");

    // Default styling
    button.style.backgroundColor = "black";
    button.style.color = "white";

    if (isPhishing) {
      // Phishing styling
      button.innerText = "Scam";
      button.style.backgroundColor = "red";
    } else {
      // Genuine styling
      button.innerText = "Genuine!";
      button.style.backgroundColor = "green";
    }
  }
  // Function to update website name and accuracy text based on the prediction result
  function updateWebsiteDetails(isPhishing) {
    var websiteName = document.getElementById("website");
    var accuracyText = document.getElementById("accuracy-text");

    // accuracyText.innerText = "";
    if (isPhishing) {
      // Phishing styling
      websiteName.style.color = "red";
      accuracyText.innerText = "";
    } else {
      // Genuine styling
      websiteName.style.color = "green";
      accuracyText.style.color = "green";
      accuracyText.innerText = "with accuracy of 97.5% is";
      // Display accuracy text
      // accuracyText.innerText = 'with accuracy of 97.5% is';
    }
  }
  function makePrediction(url) {
    // Simulate a delay (replace with your actual logic)
    var apiUrl = "http://127.0.0.1:33507/check-url";
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     // Call your machine learning model to get the prediction result
    //     // You'll need to implement this part based on your model and its integration
    //     // Resolve with true if phishing, false otherwise
    //     // For example:
    //     // resolve(fetch('YOUR_MODEL_API_ENDPOINT', { method: 'POST', body: JSON.stringify({ url: url }) })
    //     //   .then(response => response.json())
    //     //   .then(data => data.isPhishing));
    //     resolve(false); // Replace this line with actual logic
    //   }, 2000); // Simulate a 2-second delay
    // });
    try {
      const response = fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      }).then(
        (response) => response.json()
        // .then((data) => data.isPhishing)
      );
      if (response.ok) {
        const prediction = response.json().prediction;
        const resultDiv = document.getElementById("accuracy-text");
        resultDiv.innerText =
          prediction === 0 ? " " : "with accuracy of 97.5% is";
      } else {
        console.error("Request failed:", response.status);
      }
    } catch (error) {
      console.error(error);
    }
    // }
  }

  function showLoading(isLoading) {
    // Toggle visibility of the loading element
    var loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = isLoading ? "block" : "none";
  }
});
