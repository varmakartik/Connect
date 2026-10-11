// Runs only on Connect's own pages (see manifest "content_scripts.matches").
// It lets the web app know the extension is installed and relays "open and
// fill" requests from the page to the background worker.

document.documentElement.dataset.connectAutofill = chrome.runtime.getManifest().version;

window.addEventListener("message", (event) => {
  // Only accept messages the Connect page posted to itself
  if (event.source !== window || event.origin !== window.location.origin) return;
  const data = event.data;
  if (!data || data.source !== "connect-app" || data.type !== "AUTOFILL_OPEN") return;

  chrome.runtime.sendMessage(
    {
      type: "AUTOFILL_OPEN",
      url: data.url,
      username: data.username || "",
      password: data.password || "",
    },
    (response) => {
      const failed = chrome.runtime.lastError || !response?.ok;
      window.postMessage(
        {
          source: "connect-extension",
          type: "AUTOFILL_RESULT",
          requestId: data.requestId,
          ok: !failed,
          error: failed ? response?.error || chrome.runtime.lastError?.message || "Autofill failed" : null,
        },
        window.location.origin
      );
    }
  );
});
