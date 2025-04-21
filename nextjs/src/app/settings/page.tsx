"use client";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useState } from "react";
import {
  getPanelClasses,
  getHeaderDividerClasses,
  getHeadingClasses,
  getSubtextClasses,
  getSecondaryBgClasses,
  getTextClasses,
} from "@/utils/darkModeClasses";
import { Copy, Check } from "lucide-react";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import generateApiKey from "@/requests/user/generateApiKey";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function Settings() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { tokenData } = useAuthStore();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!tokenData?.access_token) return;

    setIsLoading(true);
    try {
      console.log("Generating API key...");

      const key = await generateApiKey(tokenData.access_token);
      setApiKey(key);
    } catch (error) {
      console.error("Failed to generate API key:", error);
      // TODO: Add error handling/notification
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

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

            {/* API Key Section */}
            <div>
              <h2
                className={`text-lg font-medium mb-4 ${getHeadingClasses(
                  isDarkMode
                )}`}
              >
                API Access
                <InfoTooltip content="Generating a new API key will immediately invalidate your previous key. Make sure to update any applications using the old key." />
              </h2>
              <div
                className={`rounded-lg p-4 ${getSecondaryBgClasses(
                  isDarkMode
                )}`}
              >
                <div className="space-y-4">
                  <div>
                    <p className={`text-sm ${getTextClasses(isDarkMode)}`}>
                      Generate an API key to access your data from external
                      applications
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleGenerateApiKey}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Generate New API Key
                    </button>
                    {apiKey && (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-blue-600">
                          ••••••••••••••••
                        </span>
                        <button
                          onClick={() => copyToClipboard(apiKey)}
                          className={`p-2 rounded-md transition-colors ${
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-200"
                          }`}
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
