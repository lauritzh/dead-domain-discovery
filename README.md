# Discover Dead Domains

This Chromium extensions aims to identify abandoned domains that are referenced by a website for instance within an iFrame, as script or as CSS source.     
If an abandoned domain is used within these sinks, which can be registered by malicious actors, this could for instance lead to *Cross-Site Scripting* or website defacement vulnerabilities. 



## Features
* Gather relevant sources, keep track of previously encountered domains
* Lookup domain and send a [Chrome Notification](https://developer.chrome.com/docs/extensions/reference/api/notifications) in case a domain lookup fails.

## Installation
*Always keep in mind that browser extensions have broad access to sensitive data! Therefore, it is recommended to install this extension only to browsers that are solely used for security analysis or development purposes. One great example for this is [PortSwigger's Burp Suite embedded browser](https://portswigger.net/burp/documentation/desktop/functions/embedded-browser).*

1. Clone this repository.
2. Visit chrome://extensions/.
3. Enable *Developer mode* (attention, do not enable this option in your "productive" browser!).
4. Load the unpacked extension.

## Privacy
The extension does not disclose any information to its author, but uses an HTTP GET request to `https://dns.google/resolve?name=${domain}` to lookup newly discovered domains.

## Security Considerations
If you found any vulnerability in this repository, please use GitHub's [private vulnerability reporting](https://github.com/lauritzh/dead-domain-discovery/security) instead of opening a public issue.

## Disclaimer
*Any information shared within this repository must not be used with malicious intentions. This tool is shared for educational purposes only. Any malicious use will not hold the author responsible.*
