// Theme preference, stored so the loading screens (shown before the dashboard
// mounts) match the user's choice. Light is the default. index.html reads the
// same key to paint the page background before any JavaScript runs.
const THEME_KEY = "connect_theme";

export const getStoredIsDarkMode = () => {
  try {
    return localStorage.getItem(THEME_KEY) === "dark";
  } catch {
    return false;
  }
};

export const storeIsDarkMode = (isDark) => {
  try {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  } catch {
    // Storage unavailable — the theme just won't persist across reloads
  }
  const root = document.documentElement;
  root.style.colorScheme = isDark ? "dark" : "light";
  root.style.backgroundColor = isDark ? "#020617" : "#f8fafc";
};
