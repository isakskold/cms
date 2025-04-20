interface Props {
  projectExist: boolean;
}

const Header: React.FC<Props> = ({ projectExist }) => {
  let headerText: string;

  if (projectExist) {
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
