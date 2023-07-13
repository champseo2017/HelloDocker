
const Loading = (): JSX.Element => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
};

export default Loading;

