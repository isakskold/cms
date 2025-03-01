"use client";

import { usePathname } from "next/navigation";
import useSidebarStore from "@/stores/useSidebarStore";
import Logo from "../ui/sidebar/Logo";
import Option from "../ui/sidebar/Option";
import Logout from "../ui/sidebar/Logout";
import Close from "../ui/sidebar/Close";

interface Props {
  classname?: string;
}

const Sidebar: React.FC<Props> = () => {
  const pathname = usePathname();
  const options = ["Dashboard", "Settings", "Help"];
  const { isOpen } = useSidebarStore();

  // If sidebar is not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed flex flex-col items-center w-full h-full bg-violet-900">
      <div className="flex justify-between w-full px-5">
        <Logo />
        <Close />
      </div>

      <div className="flex flex-col my-auto gap-20 w-full">
        {options.map((option, index) => {
          const route = `/${option.toLowerCase()}`;
          const isActive = pathname === route; // Check if the current route matches the option

          return (
            <Option
              key={index}
              label={option}
              link={route}
              // Apply active class for selected option
              className={isActive ? " text-white" : ""}
            />
          );
        })}
      </div>

      <Logout />
    </div>
  );
};

export default Sidebar;
