//
// (c) Lauritz Holtmann
//

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const saveOptions = () => {
    const cacheDuration = document.getElementById('cache-duration').value;
    const ignoredDomains = document.getElementById('ignored-domains').value.split('\n').map(domain => domain.trim()).filter(domain => domain);

    chrome.storage.sync.set(
        { cacheDuration, ignoredDomains },
        () => {
            // Update status to let user know options were saved.
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        }
    );
};

const restoreOptions = () => {
    chrome.storage.sync.get(
        { cacheDuration: WEEK_IN_MS, ignoredDomains: [] },
        (items) => {
            document.getElementById('cache-duration').value = items.cacheDuration;
            document.getElementById('ignored-domains').value = items.ignoredDomains.join('\n');
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);