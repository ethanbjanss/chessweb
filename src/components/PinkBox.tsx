interface PinkBoxProps {
  words?: string;
  image?: string;
}

const PinkBox = (props: PinkBoxProps) => {
  return (
    <div className="select-none cursor-move flex flex-col p-4 rounded-md items-center justify-center mb-4 bg-red-400">
      {props.words || "Default Text"}
      {props.image && (
        <img
          src={props.image}
          alt="Pink Box"
          className="w-32 h-32 object-cover mt-2 rounded-md"
        />
      )}
    </div>
  );
};
export default PinkBox;
