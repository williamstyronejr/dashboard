const Modal: React.FC<{
  onSuccess: Function;
  onClose: Function;
  children?: React.ReactNode;
}> = ({ onSuccess, onClose, children }) => {
  return (
    <div className="flex flex-row flex-nowrap w-full h-full absolute top-0 left-0 bg-neutral-900/40 z-30 items-center justify-center">
      <div className="flex-grow max-w-lg p-10 relative rounded-md bg-custom-bg-off-light dark:bg-custom-bg-off-dark">
        <button
          className="absolute right-5 top-3 px-3 py-1 text-2xl rounded-full transition motion-reduce:transition-none hover:bg-custom-bg-light hover:dark:bg-custom-bg-dark"
          type="button"
          onClick={() => onClose()}
        >
          X
        </button>

        <div className="text-center py-4">{children}</div>

        <div className="flex flex-row justify-center">
          <button
            className="bg-sky-500 hover:bg-sky-700 text-center text-white px-4 py-2 mr-4 rounded-lg"
            type="button"
            onClick={() => onSuccess()}
          >
            Yes
          </button>

          <button
            className="bg-red-500 hover:bg-red-700 text-center text-white px-4 py-2 rounded-lg"
            type="button"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
