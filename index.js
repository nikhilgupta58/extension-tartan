// popup.js
document.addEventListener("DOMContentLoaded", function () {
  const extractButton = document.getElementById("extractButton");

  extractButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: extractDOM,
      });
    });
  });
});

// function extractDOM() {
//   const domDetails = {
//     title: document.title,
//     url: window.location.href,
//     body: document.body.innerHTML,
//     // Add more details as needed
//   };
//   const htmlString = domDetails?.body;
//   const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g;
//   chrome.runtime.sendMessage({ action: "domDetails", data: htmlString });

//   // Extract PAN numbers from HTML string
//   const panMatches = htmlString.match(panRegex);
//   const matches = Array.from(htmlString.matchAll(panRegex), (match) => ({
//     panNumber: match[0],
//     parentClassName: getParentClassName(htmlString, match.index),
//   }));
//   // chrome.runtime.sendMessage({ action: "domDetails", data: "matches" });
//   // Display the extracted PAN numbers
//   if (panMatches) {
//     chrome.runtime.sendMessage({ action: "domDetails", data: panMatches?.[0] });
//   } else {
//     chrome.runtime.sendMessage({ action: "domDetails", data: "Nothing found" });
//   }
// }

function extractDOM() {
  const htmlString = document?.body?.innerHTML;
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;

  // Define the regex pattern for PAN
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;

  // Function to find the element containing PAN
  function findElementWithPan(node) {
    // Check if the current node is a text node
    if (node.nodeType === Node.TEXT_NODE) {
      // Check if the text matches the PAN regex
      if (panRegex.test(node.nodeValue)) {
        return true;
      }
    }

    // Recursively check child nodes
    for (const childNode of node.childNodes) {
      if (findElementWithPan(childNode)) {
        chrome.runtime.sendMessage({
          action: "dd",
          data: findElementWithPan(childNode),
        });
        return true;
      }
    }

    return false;
  }

  // Use the function to find the element
  const elementWithPan = findElementWithPan(tempElement);

  // Log the result
  if (elementWithPan) {
    chrome.runtime.sendMessage({ action: "domDetails", data: elementWithPan });
  } else {
    chrome.runtime.sendMessage({
      action: "domDetails",
      data: "elementWithPan",
    });
  }

  // Function to get the class name of the parent element
}
