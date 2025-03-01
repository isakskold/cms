import Link from "next/link";
import useSidebarStore from "@/stores/useSidebarStore";

interface Props {
  label: string;
  link: string;
  className?: string;
}

const Option: React.FC<Props> = ({ label, link, className }) => {
  const { toggleSidebar } = useSidebarStore(); // Access the store's toggleSidebar action

  const handleClick = () => {
    toggleSidebar(); // Toggle the sidebar visibility
  };

  return (
    <div onClick={handleClick} className="w-full">
      <Link
        href={link}
        passHref
        className={`${className} block text-center font-semibold text-2xl`}
      >
        {label}
      </Link>
    </div>
  );
};

export default Option;
