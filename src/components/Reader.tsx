import { useState } from "react";

const Reader = () => {
  const [menu, setMenu] = useState(false);

  return (
    <aside className={`shrink-0 ${menu ? "w-52" : "w-16"}`}>
      aside
      <button
        className=""
        type="button"
        onClick={() => {
          setMenu(!menu);
        }}
      >
        Close
      </button>
    </aside>
  );
};

export default Reader;
