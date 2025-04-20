"use client";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import useSidebarStore from "@/stores/useSidebarStore";
import { usePathname, useRouter } from "next/navigation";

const MobileHeader: React.FC = () => {
  const { isOpen, setSidebar } = useSidebarStore();
  const pathname = usePathname(); // Get current route
  const router = useRouter();

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
      <button
        className="ml-auto text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
        onClick={handleCLick}
      >
        <FaBars size={24} />
      </button>
    </div>
  );
};

export default MobileHeader;
