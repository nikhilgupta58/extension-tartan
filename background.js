// background.js
chrome.runtime.onInstalled.addListener(function () {
  console.log("Extension Installed");
  // console.log(chrome)
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Log the message from content.js
  // console.log(request?.data);

  // You can send a response back to content.js if needed
  // sendResponse({ backgroundMessage: "Message received in background.js!" });
});
