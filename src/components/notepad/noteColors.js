// Text color swatches for the notepad. Ids are persisted in localStorage, so the
// CSS value has to be resolved here — names like "emerald" or "rose" are not
// valid CSS colors and were silently ignored by the browser.
export const NOTE_COLORS = [
  { id: "default", label: "Default", dark: "#f8fafc", light: "#1e293b" },
  { id: "blue", label: "Blue", dark: "#60a5fa", light: "#2563eb" },
  { id: "emerald", label: "Emerald", dark: "#34d399", light: "#059669" },
  { id: "amber", label: "Amber", dark: "#fbbf24", light: "#d97706" },
  { id: "rose", label: "Rose", dark: "#fb7185", light: "#e11d48" },
  { id: "purple", label: "Purple", dark: "#c084fc", light: "#9333ea" },
];

export const resolveNoteColor = (id, isDarkMode) => {
  const match = NOTE_COLORS.find((c) => c.id === id) || NOTE_COLORS[0];
  return isDarkMode ? match.dark : match.light;
};
