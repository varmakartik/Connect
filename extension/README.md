# Connect Autofill (browser extension)

Fills a saved login from the Connect **Credentials** vault when you press **Open**.

Websites are not allowed to type into other websites' forms, so this has to be a
browser extension. It works in desktop Chrome, Edge, Brave and other Chromium
browsers. Chrome on Android does not support extensions; there, Open copies the
password for you to paste.

## Install (developer mode)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this `extension` folder.
4. Reload the Connect tab. The Credentials header shows **Autofill on**.

## How it works

1. **Open** in Connect posts the selected login to `bridge.js`. That content script only runs on Connect's own pages, listed in `manifest.json` and in `CONNECT_ORIGINS` in `background.js`.
2. `background.js` opens the website in a new tab and keeps the login in memory-only `chrome.storage.session`, tied to that tab.
3. When the tab loads a page on the saved site (or one of its subdomains), the filler fills the username and password fields. Logins split across two pages work too.
4. The stored login is deleted as soon as the password is filled, when the tab closes, or after 2 minutes. The form is never submitted automatically.

## Using a different domain

If Connect is served from another domain, add it in two places:

- `content_scripts.matches` in `manifest.json`
- `CONNECT_ORIGINS` in `background.js`

Then reload the extension.

## Why it asks for access to all sites

Your saved logins can be for any website, so the extension needs permission to
fill forms on any site. It only acts on a tab it opened itself from Connect.
