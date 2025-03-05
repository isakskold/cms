interface Props {
  action: "save" | "discard";
  onClick: () => void;
}

const SaveOrDiscardBtn: React.FC<Props> = ({ action, onClick }) => {
  const buttonText = action === "save" ? "Save" : "Discard";
  const buttonColor =
    action === "save"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-yellow-600 hover:bg-yellow-700";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 w-24 text-white rounded ${buttonColor}`}
    >
      {buttonText}
    </button>
  );
};

export default SaveOrDiscardBtn;
