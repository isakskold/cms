"use client";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import useSidebarStore from "@/stores/useSidebarStore";
import { usePathname, useRouter } from "next/navigation";
import { useThemeStore } from "@/stores/theme/useThemeStore";

const MobileHeader: React.FC = () => {
  const { isOpen, setSidebar } = useSidebarStore();
  const pathname = usePathname(); // Get current route
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const handleCLick = () => {
    setSidebar(true);
  };

  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  // If sidebar is open or on the default route ("/"), return null
  if (isOpen || pathname === "/") return null;

  return (
    <div className="flex fixed top-0 left-0 w-full justify-between items-center px-4 py-3 border-b border-gray-700/20 bg-gray-900/80 backdrop-blur-sm shadow-lg z-[999]">
      {/* Conditionally render the back button if the pathname is not "/dashboard" */}
      {pathname !== "/dashboard" && (
        <button
          onClick={handleBack}
          className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
        >
          <FaArrowLeft size={24} />
        </button>
      )}
      <div className="flex items-center space-x-2 ml-auto">
        <button
          onClick={toggleDarkMode}
          className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
        <button
          className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
          onClick={handleCLick}
        >
          <FaBars size={24} />
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
