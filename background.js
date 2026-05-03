//
// (c) Lauritz Holtmann
//

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details?.tab?.url?.startsWith("chrome://")) return undefined;

  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ['content.js']
  });
}, { url: [{ urlMatches: 'https?://*/*' }] });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'checkDomains') {
    checkAndStoreDomains(message.domains, message.pageUrl);
  }
});

function checkAndStoreDomains(pageDomains, pageUrl) {
  chrome.storage.local.get(['domains'], ({ domains }) => {
    chrome.storage.sync.get(
      { cacheDuration: WEEK_IN_MS },
      ({ cacheDuration }) => {

        let storedDomains = domains || {};
        const now = Date.now();
        const domainResults = {};
        let pendingCount = 0;

        // Clean up old entries
        for (let domain in storedDomains) {
          if (storedDomains[domain].timestamp < now - cacheDuration) {
            delete storedDomains[domain];
          }
        }

        pageDomains.forEach(domain => {
          if (!storedDomains.hasOwnProperty(domain.domain)) {
            if (!isIpAddress(domain.domain)) {
              pendingCount++;
              resolveDomain(domain.domain, (resolvable) => {
                domainResults[domain.domain] = {
                  timestamp: now,
                  pageUrl: domain.pageUrl,
                  sinkElement: domain.sinkElement,
                  dead: !resolvable
                };
                pendingCount--;

                if (!resolvable) {
                  createNotification(`Domain not resolvable: ${domain.domain}\n\nFound on: ${domain.pageUrl}\n\nElement: ${domain.sinkElement}`);
                }

                if (pendingCount === 0) {
                  Object.assign(storedDomains, domainResults);
                  chrome.storage.local.set({ domains: storedDomains });
                }
              });
            }
          }
        });
      });
  });
}

function isIpAddress(domain) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(domain);
}

function resolveDomain(domain, callback) {
  if (domain.trim() != '') {
    fetch(`https://dns.google/resolve?name=${domain}`)
      .then(response => response.json())
      .then(data => {
        callback(data.Answer && data.Answer.length > 0);
      })
      .catch(() => {
        callback(false);
      });
  }
}

function createNotification(message) {
  chrome.notifications.create({
    type: 'basic',
    title: '🚨 Dead Domain Discovery 🚨',
    iconUrl: 'icons/icon48.png',
    message: message
  });
}
