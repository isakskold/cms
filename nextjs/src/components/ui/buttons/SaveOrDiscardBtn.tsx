import { useState } from "react";
import Loading from "@/components/utils/loading";

interface Props {
  action: "save" | "discard";
  onClick: () => Promise<void> | void; // Supports async functions
}

const SaveOrDiscardBtn: React.FC<Props> = ({ action, onClick }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onClick(); // Ensure it waits for any async action
    setLoading(false);
  };

  if (loading) return <Loading text="" />;

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 w-24 text-white rounded ${
        action === "save"
          ? "bg-green-600 hover:bg-green-700"
          : "bg-yellow-600 hover:bg-yellow-700"
      }`}
    >
      {action === "save" ? "Save" : "Discard"}
    </button>
  );
};

export default SaveOrDiscardBtn;
