// Shorten long URLs for messages: keep the host and the start of the path.
export const shortenUrl = (url, max = 48) => {
  const text = (url || "").replace(/^https?:\/\//i, "");
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};
