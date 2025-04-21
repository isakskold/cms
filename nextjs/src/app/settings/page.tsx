"use client";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import {
  getPanelClasses,
  getHeaderDividerClasses,
  getHeadingClasses,
  getSubtextClasses,
  getSecondaryBgClasses,
  getTextClasses,
} from "@/utils/darkModeClasses";

export default function Settings() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div
        className={`rounded-lg shadow-sm border ${getPanelClasses(isDarkMode)}`}
      >
        <div className={`p-6 border-b ${getHeaderDividerClasses(isDarkMode)}`}>
          <h1 className={`text-2xl font-bold ${getHeadingClasses(isDarkMode)}`}>
            Settings
          </h1>
          <p className={`mt-1 text-sm ${getSubtextClasses(isDarkMode)}`}>
            Manage your account settings and preferences
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div>
              <h2
                className={`text-lg font-medium mb-4 ${getHeadingClasses(
                  isDarkMode
                )}`}
              >
                Appearance
              </h2>
              <div
                className={`rounded-lg p-4 flex items-center justify-between ${getSecondaryBgClasses(
                  isDarkMode
                )}`}
              >
                <p className={`text-sm ${getTextClasses(isDarkMode)}`}>
                  Dark Mode
                </p>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    isDarkMode ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isDarkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
