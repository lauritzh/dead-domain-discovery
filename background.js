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
    checkAndStoreDomains(message.domains);
  }
});

function checkAndStoreDomains(domains) {
  chrome.storage.local.get(['domains'], (result) => {
    let storedDomains = result.domains || {};
    const now = Date.now();

    // Clean up old entries
    for (let domain in storedDomains) {
      if (storedDomains[domain] < now - WEEK_IN_MS) {
        delete storedDomains[domain];
      }
    }

    domains.forEach(domain => {
      if (!storedDomains.hasOwnProperty(domain)) {
        resolveDomain(domain, (resolvable) => {
          storedDomains[domain] = now;
          chrome.storage.local.set({ domains: storedDomains });
          if (!resolvable) {
            createNotification(`Domain not resolvable, but used to load external contents: ${domain}`);
          }
        });
      }
    });
  });
}

function resolveDomain(domain, callback) {
  if(domain.trim() != '') {
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
