//
// (c) Lauritz Holtmann
//

document.addEventListener('DOMContentLoaded', function () {
    document
    .querySelector("#go-to-options")
    .addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });

    const domainStats = document.getElementById('domain-stats');
    const findingsList = document.getElementById('findings');
    const clearFindingsButton = document.getElementById('clear-findings');
  
    // Fetch and display the number of non-resolvable dead domains found
    chrome.storage.local.get(['domains'], ({ domains }) => {
      const nonResolvableDomains = Object.keys(domains || {}).map(domainKey => {
        const domain = domains[domainKey];
        // Only include domains with pageUrl and sinkElement (non-resolvable)
        if (domain.pageUrl && domain.sinkElement) {
          return {
            domain: domainKey,  // Add domain key back here
            pageUrl: domain.pageUrl,
            sinkElement: domain.sinkElement
          };
        }
        return null;  // Filter out non-matching domains
      }).filter(Boolean); // Remove any null values
  
      const deadDomainsCount = nonResolvableDomains.length;
      domainStats.textContent = `Found ${deadDomainsCount} Dead Domain(s).`;
  
      // Display the findings in the findingsList
      findingsList.innerHTML = '';
      nonResolvableDomains.forEach(domain => {
        const listItem = document.createElement('li');
        listItem.textContent = `Domain: ${domain.domain}, URL: ${domain.pageUrl}, Element: ${domain.sinkElement}`;
        findingsList.appendChild(listItem);
      });
    });
  
    // Clear cached domains
    clearFindingsButton.addEventListener('click', () => {
      chrome.storage.local.remove(['domains'], () => {
        domainStats.textContent = 'Found 0 Dead Domains';
        findingsList.innerHTML = '';
      });
    });
});
      