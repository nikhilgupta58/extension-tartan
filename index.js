// const verifyPan = require("./src/repo/verifyPan");

// popup.js
document.addEventListener("DOMContentLoaded", function () {
  const extractButton = document.getElementById("extractButton");

  extractButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: init,
      });
    });
  });
});

function init() {
  // Network call for PAN
  function verifyPan(pan) {
    console.log(pan);
    const payload = {
      category: "individual-pii-data",
      type: "pan-detail-v2",
      applicationId: "Dashboard-realtime-KYC",
      data: {
        panNumber: pan,
      },
      mode: "PROD",
    };
    const endpoint = `https://api-prod.tartanhq.com/aphrodite/api/tp/v1/verification`;
    const token = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0YXJ0YW4iLCJleHAiOjE3MDE3MTQ0MTAsImlhdCI6MTcwMTY5NjQxMH0.rz-b9yMXS8XubqhC4hv3stmhZTsv66Y4UbYU9oac_KsKLwd9b3-uIKQlCi58OAs-MSuiVGRR4-MZ4Dz3eNgmdA`;
    return fetch(endpoint, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(payload),
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json", // Corrected property name
      },
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return false;
      })
      .then((response) => {
        console.log("[response]", response);
        return response && response.response && response.response.isValid;
      });
    // return fetch(endpoint, payload, { headers: token })
    //   .then((data) => data.json())
    //   .catch((error) => {
    //       console.log(error);
    //       return false;
    //   })
    //   .then((response) => {
    //       console.log("[response]", response);
    //       return response && response.response && response.response.isValid;
    //   });
  }

  // Parse DOM
  function extractDOM() {
    const unVerifiedIcon =
      "https://res.cloudinary.com/dzfkhe75f/image/upload/v1701683698/cursor-click-02-svgrepo-com_tf24yk.svg";
    const verifedIcon =
      "https://res.cloudinary.com/dzfkhe75f/image/upload/v1701683393/verify-svgrepo-com_1_xd4tbu.svg";
    const pendingIcon =
      "https://res.cloudinary.com/dzfkhe75f/image/upload/v1701696067/system-pending-line-svgrepo-com_rsu0um.svg";
    const selector = `span.ng-scope.ng-binding[ng-switch-when="masked"]`;
    const element = document.querySelector(selector);
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    const panMatches = document?.body?.innerHTML?.match(panRegex)?.[0];
    const span = document.createElement("span");
    span.classList.add("verifyThis");
    span.style.cursor = "pointer";
    const iconImage = document.createElement("img");
    iconImage.src = unVerifiedIcon;
    iconImage.alt = "Unverified Icon";
    iconImage.width = 30;
    iconImage.height = 30;
    // span.addEventListener("click", function () {
    //   chrome.runtime.sendMessage({ action: "domDetails", data: panMatches });
    // });
    span.addEventListener("click", function () {
      verifyPan(panMatches).then((data) => {
        if (data) {
          iconImage.src = verifedIcon;
        } else {
          iconImage.src = pendingIcon;
        }
      });
    });

    span.appendChild(iconImage);
    element.appendChild(span);
  }

  extractDOM();
}

// chrome.runtime.sendMessage({ action: "domDetails", data: elementWithPan });
