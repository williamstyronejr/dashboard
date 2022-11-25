import { useEffect, useState, RefObject } from "react";

const useDetectClick = ({ ref }: { ref: RefObject<HTMLElement> }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onOuterClick = (e: any) => {
      if (ref.current !== null && !ref.current.contains(e.target)) {
      }
    };

    window.addEventListener("click", onOuterClick);
    return () => window.removeEventListener("click", onOuterClick);
  }, []);

  return [visible, setVisible];
};

export default useDetectClick;
