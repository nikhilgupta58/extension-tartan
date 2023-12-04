// const verifyPan = require("./src/repo/verifyPan");

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
  function verifyPan(pan) {
    const payload = {
      category: "individual-pii-data",
      type: "pan-detail-v2",
      applicationId: "Dashboard-realtime-KYC",
      data: { panNumber: pan },
      mode: "PROD",
    };
    const endpoint = `https://api-prod.tartanhq.com/aphrodite/api/tp/v1/verification`;
    const token = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJiYXRpa3N0YWdlZmFzdHRyYWNrIiwiZXhwIjoxNzAxNzAxNDI1LCJpYXQiOjE3MDE2ODM0MjV9.u0xszsidwoeqnVOONTnbgx2QbcNHDKcWlcmh86RBlA8Tv5WtlkfmaIu5nyYEVgyCWSNRdTIfg41VW15eHUVqew`;
    return fetch(endpoint, payload, { headers: token })
      .then((data) => data.json())
      .catch((error) => {
        console.log(error);
        return false;
      })
      .then((response) => {
        return response && response.response && response.response.isValid;
      });
  }
  const unVerifiedIcon =
    "https://res.cloudinary.com/dzfkhe75f/image/upload/v1701683698/cursor-click-02-svgrepo-com_tf24yk.svg";
  const verifedIcon =
    "https://res.cloudinary.com/dzfkhe75f/image/upload/v1701683393/verify-svgrepo-com_1_xd4tbu.svg";
  const selector = `span.ng-scope.ng-binding[ng-switch-when="masked"]`;
  const element = document.querySelector(selector);
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  const panMatches = document?.body?.innerHTML?.match(panRegex)?.[0];
  const span = document.createElement("span");
  span.addEventListener("click", function () {
    verifyPan(panMatches);
  });
  span.style.cursor = "pointer";
  const iconImage = document.createElement("img");
  iconImage.src = unVerifiedIcon;
  iconImage.alt = "Unverified Icon";
  iconImage.width = 30;
  iconImage.height = 30;

  span.appendChild(iconImage);
  element.appendChild(span);
}

// chrome.runtime.sendMessage({ action: "domDetails", data: elementWithPan });
