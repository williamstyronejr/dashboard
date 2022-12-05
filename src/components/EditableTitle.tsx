import { useQuery } from "@tanstack/react-query";
import { useRef, FC, useState } from "react";
import useDetectClick from "../hooks/useDetectClick";

const EditableTitle: FC<{ title: string }> = ({ title }) => {
  const [input, setInput] = useState(title);
  const outerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useDetectClick({ ref: outerRef });

  return (
    <div className="w-full" ref={outerRef}>
      {visible ? (
        <input value={input} onChange={(evt) => setInput(evt.target.value)} />
      ) : (
        <div className="" onClick={() => setVisible(true)}>
          {title}
        </div>
      )}
    </div>
  );
};

export default EditableTitle;
