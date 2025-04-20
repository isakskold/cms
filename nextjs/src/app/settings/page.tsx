"use client";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function Settings() {
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Profile Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Profile settings coming soon...
                </p>
              </div>
            </div>

            {/* Account Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Account Settings
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Account settings coming soon...
                </p>
              </div>
            </div>

            {/* Logout Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Session Management
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <button
                  onClick={() => {
                    setIsLoading(true);
                    logout();
                  }}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    "Logout"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
