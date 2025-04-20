"use client";

import { X } from "lucide-react";
import useSidebarStore from "@/stores/useSidebarStore";

const Close = () => {
  const { setSidebar } = useSidebarStore();

  const handleClick = () => {
    setSidebar(false);
  };

  return (
    <button
      onClick={handleClick}
      className="p-3 rounded-full transition-all duration-300 hover:bg-white/10 group"
    >
      <X className="w-8 h-8 text-white/80 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
    </button>
  );
};

export default Close;
