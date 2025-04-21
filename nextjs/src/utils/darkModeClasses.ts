/**
 * Utility functions to generate dark mode class names consistently across the application
 * These functions take the isDarkMode state and return the appropriate classes
 */

// For main content panels/containers
export const getPanelClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-panel dark-mode-border" : "bg-white border-gray-200";

// For section headers and dividers
export const getHeaderDividerClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-border" : "border-gray-200";

// For main headings (h1, h2)
export const getHeadingClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-heading" : "text-gray-900";

// For subheadings (h3, h4)
export const getSubheadingClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-heading" : "text-gray-800";

// For regular text content
export const getTextClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-text" : "text-gray-600";

// For secondary/smaller text
export const getSubtextClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-subtext" : "text-gray-500";

// For form input backgrounds
export const getInputBgClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-bg border-gray-700" : "bg-white border-gray-300";

// For secondary backgrounds (cards, etc)
export const getSecondaryBgClasses = (isDarkMode: boolean): string =>
  isDarkMode ? "dark-mode-bg" : "bg-gray-50";

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
