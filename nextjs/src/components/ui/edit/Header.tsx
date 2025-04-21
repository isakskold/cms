interface Props {
  projectExist: boolean;
  isLoading?: boolean;
}

const Header: React.FC<Props> = ({ projectExist, isLoading = false }) => {
  let headerText: string;

  if (isLoading) {
    headerText = "Loading project...";
  } else if (projectExist) {
    headerText = "Edit your project";
  } else {
    headerText = "Create a new project";
  }

  return (
    <div className="mb-8">
      <h1 className="text-4xl text-center font-semibold text-white">
        {headerText}
      </h1>
    </div>
  );
};

export default Header;
