"use client";

import { useTransition, animated } from "@react-spring/web";
import { ReactNode } from "react";

const Menu = ({
  className,
  visible,
  children = "",
}: {
  className?: string;
  visible: boolean;
  children: ReactNode;
}) => {
  const fadeTransition = useTransition([visible], {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return fadeTransition((style, toggle) =>
    toggle ? (
      <animated.div style={style} className={className}>
        {children}
      </animated.div>
    ) : null
  );
};

export default Menu;
