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

function extractDOM() {
  const unVerifiedIcon =
    "https://res.cloudinary.com/dzfkhe75f/image/upload/v1701683698/cursor-click-02-svgrepo-com_tf24yk.svg";
  const verifedIcon =
    "https://res.cloudinary.com/dzfkhe75f/image/upload/v1701683393/verify-svgrepo-com_1_xd4tbu.svg";
  const selector = `span.ng-scope.ng-binding[ng-switch-when="masked"]`;
  const element = document.querySelector(selector);
  const span = document.createElement("span");
  span.addEventListener("click", function () {
    alert("span clicked!");
  });
  span.style.cursor = "pointer";
  const iconImage = document.createElement("img");
  iconImage.src = unVerifiedIcon;
  iconImage.alt = "Unverified Icon";
  iconImage.width = 30;
  iconImage.height = 30;

  span.appendChild(iconImage);
  element.appendChild(span);
  if (element) {
    console.log(element.outerHTML);
  } else {
    console.log("empty");
  }
}

// chrome.runtime.sendMessage({ action: "domDetails", data: elementWithPan });
