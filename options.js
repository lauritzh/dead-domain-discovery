const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const saveOptions = () => {
    const cacheDuration = document.getElementById('cache-duration').value;

    chrome.storage.sync.set(
        { cacheDuration },
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
        { cacheDuration: WEEK_IN_MS },
        (items) => {
            document.getElementById('cache-duration').value = items.cacheDuration;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);