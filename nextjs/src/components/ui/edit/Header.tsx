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
    <h1 className="text-4xl text-center font-semibold text-white mb-14">
      {headerText}
    </h1>
  );
};

export default Header;
