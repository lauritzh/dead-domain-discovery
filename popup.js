document
    .querySelector("#go-to-options")
    .addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });