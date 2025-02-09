"use client";

import useSidebarStore from "@/stores/useSidebarStore";

interface Props {}

const Close: React.FC<Props> = () => {
  const { toggleSidebar } = useSidebarStore();
  const handleClick = () => {
    toggleSidebar();
  };
  return (
    <button className="text-3xl p-3" onClick={handleClick}>
      X
    </button>
  );
};

export default Close;
