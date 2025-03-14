import Overview from "@/components/layout/Overview";
import NewProjectBtn from "./NewProjectBtn";

interface Props {}

const page: React.FC<Props> = () => {
  return (
    <div className="h-full flex flex-col p-4">
      <NewProjectBtn />
      <Overview />
    </div>
  );
};

export default page;
