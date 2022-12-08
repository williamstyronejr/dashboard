import { useEffect, useState, RefObject } from "react";

const useDetectClick = ({ ref }: { ref: RefObject<HTMLElement> }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (visible) {
      const onOuterClick = (e: any) => {
        if (ref.current !== null && !ref.current.contains(e.target)) {
          setVisible(false);
        }
      };

      window.addEventListener("click", onOuterClick);
      return () => window.removeEventListener("click", onOuterClick);
    }
  }, [ref, visible]);

  return [visible, setVisible];
};

export default useDetectClick;
