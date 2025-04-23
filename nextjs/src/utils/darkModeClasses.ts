/**
 * Utility functions to generate dark mode class names consistently across the application
 * These functions take the isDarkMode state and return the appropriate classes
 */

// For main content panels/containers
export const getPanelClasses = (isDarkMode: boolean): string =>
  isDarkMode
    ? "dark-mode-panel dark-mode-border"
    : "light-mode-panel light-mode-border";

// For section headers and dividers
export const getHeaderDividerClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-border" : "light-mode-border";

// For main headings (h1, h2)
export const getHeadingClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-heading" : "light-mode-heading";

// For subheadings (h3, h4)
export const getSubheadingClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-heading" : "light-mode-heading";

// For regular text content
export const getTextClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-text" : "light-mode-text";

// For secondary/smaller text
export const getSubtextClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-subtext" : "light-mode-subtext";

// For form input backgrounds
export const getInputBgClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-bg border-gray-700" : "light-mode-bg border-gray-300";

// For secondary backgrounds (cards, etc)
export const getSecondaryBgClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-bg" : "light-mode-bg";

// For buttons (primary style)
export const getPrimaryButtonClasses = (isDarkMode: boolean): string =>
  "px-4 py-2 rounded-md " +
  (isDarkMode
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white");

// For buttons (secondary style)
export const getSecondaryButtonClasses = (isDarkMode: boolean): string =>
  "px-4 py-2 rounded-md " +
  (isDarkMode
    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
    : "bg-gray-200 hover:bg-gray-300 text-gray-800");
