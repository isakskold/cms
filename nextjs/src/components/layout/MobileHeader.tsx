"use client";
import { FaBars } from "react-icons/fa";
import useSidebarStore from "@/stores/useSidebarStore";
import { usePathname } from "next/navigation";

interface Props {}

const MobileHeader: React.FC<Props> = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const pathname = usePathname(); // Get current route

  const handleCLick = () => {
    toggleSidebar();
  };

  // If sidebar is open or on the default route ("/"), return null
  if (isOpen || pathname === "/") return null;
  return (
    <button onClick={handleCLick}>
      <FaBars size={32} />
    </button>
  );
};

export default MobileHeader;
