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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-[9998]" />

      {/* Fullscreen menu */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999]">
        <div className="absolute top-8 right-8">
          <Close />
        </div>

        <div className="flex flex-col items-center space-y-8">
          <h2 className="text-4xl font-bold text-white mb-12">Menu</h2>

          {/* Menu container with background */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
            <nav className="flex flex-col items-center space-y-6">
              {options.map((option, index) => {
                const route = `/${option.toLowerCase()}`;
                return (
                  <Option
                    key={index}
                    label={option}
                    link={route}
                    className="text-2xl font-medium"
                  />
                );
              })}
            </nav>

            <div className="mt-12 pt-8 border-t border-white/10">
              <Logout />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
