import Link from "next/link";
import useSidebarStore from "@/stores/useSidebarStore";

interface Props {
  label: string;
  link: string;
  className?: string;
  icon?: React.ReactNode;
}

const Option: React.FC<Props> = ({ label, link, className, icon }) => {
  const { setSidebar } = useSidebarStore();

  const handleClick = () => {
    setSidebar(false);
  };

  return (
    <div onClick={handleClick} className="group relative w-full">
      <Link
        href={link}
        passHref
        className={`${className} relative py-3 px-6 text-gray-300 hover:text-white transition-all duration-300 w-full text-center bg-gray-900/80 backdrop-blur-sm rounded-lg block`}
      >
        {icon}
        <span className="relative z-10 block w-full">{label}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/25 to-pink-500/25 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg" />
      </Link>
    </div>
  );
};

export default Option;
