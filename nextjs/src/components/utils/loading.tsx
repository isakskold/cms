interface Props {
  text: string;
  classname?: string;
}

const Loading: React.FC<Props> = ({ text, classname }) => {
  return (
    <div className={`flex justify-center items-center ${classname}`}>
      <div
        className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-solid rounded-full text-blue-500"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <span className="ml-3">{text}</span>
    </div>
  );
};

export default Loading;
