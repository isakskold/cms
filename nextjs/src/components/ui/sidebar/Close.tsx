"use client";

import useSidebarStore from "@/stores/useSidebarStore";

interface Props {}

const Close: React.FC<Props> = () => {
  const { setSidebar } = useSidebarStore();
  const handleClick = () => {
    setSidebar(false);
  };
  return (
    <button className="text-3xl p-3" onClick={handleClick}>
      X
    </button>
  );
};

export default Close;
