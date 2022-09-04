import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useReaderContext } from "../context/readerContext";

const Reader = () => {
  const { state, setSelected, goToSlide } = useReaderContext();
  const [fullScreen, setFullScreen] = useState(true);

  const selectedMedia = useMemo(
    () => (state.selected !== null ? state.list[state.selected] : null),
    [state.selected, state.list]
  );

  return (
    <div
      className={`absolute bg-white z-50 
    ${selectedMedia ? "h-screen p-4" : "h-0"}
      ${fullScreen ? "w-screen right-0" : "w-full"}`}
    >
      <div className="relative">
        <button
          type="button"
          className={`absolute  right-2 ${selectedMedia ? "block" : "hidden"}`}
          onClick={() => setFullScreen(!fullScreen)}
        >
          <i className="fas fa-expand" />
        </button>
      </div>
    </div>
  );
};

export default Reader;
