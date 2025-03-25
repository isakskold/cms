import Overview from "@/components/layout/Overview";
import NewProjectBtn from "./NewProjectBtn";

const page: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-4">
      <NewProjectBtn />
      <Overview />
    </div>
  );
};

export default page;
