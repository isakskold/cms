import Link from "next/link";
import useSidebarStore from "@/stores/useSidebarStore";

interface Props {
  label: string;
  link: string;
  className?: string;
}

const Option: React.FC<Props> = ({ label, link, className }) => {
  const { setSidebar } = useSidebarStore(); // Access the store's toggleSidebar action

  const handleClick = () => {
    setSidebar(false); // Toggle the sidebar visibility
  };

  return (
    <div
      onClick={handleClick}
      className="transition-colors transition-text duration-300 ease-in-out w-full hover:bg-sky-950 hover:shadow-lg"
    >
      <Link
        href={link}
        passHref
        className={`${className} py-5 block text-center text-white font-semibold text-2xl`}
      >
        {label}
      </Link>
    </div>
  );
};

export default Option;
