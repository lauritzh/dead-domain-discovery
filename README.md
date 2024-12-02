# Dead Domain Discovery

This Chromium extensions aims to identify abandoned domains that are referenced by a website for instance within an iFrame, as script or as CSS source.     
If an abandoned domain is used within these sinks, which can be registered by malicious actors, this could for instance lead to *Cross-Site Scripting* or website defacement vulnerabilities. 

## Features
* Gather relevant sources, keep track of previously encountered domains.
* Lookup domains and send a [Chrome Notification](https://developer.chrome.com/docs/extensions/reference/api/notifications) in case a domain lookup fails.

## Installation
*Always keep in mind that browser extensions have broad access to sensitive data! Therefore, it is recommended to install this extension only to browsers that are solely used for security analysis or development purposes. One great example for this is [PortSwigger's Burp Suite embedded browser](https://portswigger.net/burp/documentation/desktop/functions/embedded-browser).*

Recommended way to install is via the [Chrome Web Store](https://chromewebstore.google.com/detail/dead-domain-discovery/opfeoiaampdaohnfgbbgagiicfidhegd).

Steps to install (manual):
1. Clone this repository via `git clone https://github.com/lauritzh/dead-domain-discovery`.
2. Navigate to `chrome://extensions/` with your Chromium browser.
3. Enable *Developer mode* (attention, do not enable this option in your "productive" browser!).
4. Load the unpacked extension from `/dead-domain-discovery`.

## FAQ

<details><summary>Why do I not get any results?</summary>

This extension uses the [Chrome Notification API](https://developer.chrome.com/docs/extensions/reference/api/notifications). Make sure to allow notifications for Chrome/Chromium:

![Settings](/img/notification1.png)
![Notification](/img/notification2.png)
</details>

## Notable Releases
* **0.1**: Initial Release
* **0.2**: Skip IPs
* **0.3**: Add basic options (<a href="https://github.com/svennergr">@svennergr</a>)
* **0.4**: Add basic history
* **0.5**: Scan for dead domains in e-mail addresses
* **0.6**: Fix history of findings in pop-up (previously all cached domains were printed)
* **0.7**: Exclude domains from scanning

## Privacy
The extension does not disclose any information to its author, but uses an HTTP GET request to `https://dns.google/resolve?name=${domain}` to lookup newly discovered domains. Please note that when activated, the extension runs in background and analyses all page loads.

## Security Considerations
If you found any vulnerability in this repository, please use GitHub's [private vulnerability reporting](https://github.com/lauritzh/dead-domain-discovery/security) instead of opening a public issue.

## Credits
This project was inspired by [Süleyman Çelikarslan's (@slymn_clkrsln)](https://twitter.com/slymn_clkrsln) tweets about [second order domain takeover vulnerabilities](https://twitter.com/slymn_clkrsln/status/1792995208562401567).

In v0.5, a lookup for domains encountered in `mailto:` URLs was added, based on [@0xLupin](https://twitter.com/0xLupin)'s awesome [blog post about ATOs caused by abandoned e-mail domains](https://www.landh.tech/blog/20241107-10-to-hack-millions-of-companies/).

## Contributors
If you are missing a feature or found a bug, feel free to open a pull request!

These awesome people already contributed to this repo:     
<img src="https://github.com/svennergr.png" width="60px;"/><br /><sub><a href="https://github.com/svennergr">svennergr</a></sub>     
<img src="https://github.com/TightropeMonkey.png" width="60px;"/><br /><sub><a href="https://github.com/TightropeMonkey">TightropeMonkey</a></sub>

Thanks a lot!

## Disclaimer
*Any information shared within this repository must not be used with malicious intentions. This tool is shared for educational purposes only. Any malicious use will not hold the author responsible.*

## Example

If set up correctly, the extension should complain about [this link](https://invalid-link.lhq.at) and the following ![image](https://invalid-image.lhq.at).
