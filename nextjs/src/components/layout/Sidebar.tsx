"use client";

import useSidebarStore from "@/stores/useSidebarStore";
import Option from "../ui/sidebar/Option";
import Logout from "../ui/sidebar/Logout";
import Close from "../ui/sidebar/Close";

interface Props {
  classname?: string;
}

const Sidebar: React.FC<Props> = () => {
  const options = ["Dashboard", "Settings", "Help"];
  const { isOpen } = useSidebarStore();

  // If sidebar is not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 flex flex-col overflow-auto items-center w-[100vw] h-full bg-blue-900">
      <div className="fixed top-0 right-0">
        <Close />
      </div>

      <div
        className="flex flex-col w-full"
        style={{
          marginTop: "max(10vh, 50px)",
          marginBottom: "max(10vh, 50px)",
        }}
      >
        {options.map((option, index) => {
          const route = `/${option.toLowerCase()}`;

          return <Option key={index} label={option} link={route} />;
        })}
      </div>

      <Logout />
    </div>
  );
};

export default Sidebar;
