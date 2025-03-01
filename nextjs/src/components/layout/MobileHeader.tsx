"use client";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import useSidebarStore from "@/stores/useSidebarStore";
import { usePathname, useRouter } from "next/navigation";

interface Props {}

const MobileHeader: React.FC<Props> = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const pathname = usePathname(); // Get current route
  const router = useRouter();

  const handleCLick = () => {
    toggleSidebar();
  };

  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  // If sidebar is open or on the default route ("/"), return null
  if (isOpen || pathname === "/") return null;

  return (
    <div className="flex justify-between p-2 border-b border-gray-800">
      <button onClick={handleBack} className="mr-4">
        <FaArrowLeft size={32} />
      </button>
      <button onClick={handleCLick}>
        <FaBars size={32} />
      </button>
    </div>
  );
};

export default MobileHeader;
