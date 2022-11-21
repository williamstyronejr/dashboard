"use client";

import Link from "next/link";
import { useState } from "react";
import { useTransition, animated } from "@react-spring/web";

const Home = () => {
  const [signin, setSignin] = useState(false);
  const fadeTransition = useTransition(signin, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <section className="flex flex-row flex-nowrap justify-center h-full pt-8">
      {fadeTransition((style, toggle) =>
        !toggle ? (
          <>
            <animated.div
              style={{
                position: "absolute",
                opacity: style.opacity.to({
                  range: [0.0, 1.0],
                  output: [0, 1],
                }),
              }}
            >
              <button
                className="bg-black text-white px-6 py-2 rounded-full"
                type="button"
                onClick={() => setSignin(true)}
              >
                Signin
              </button>

              <div className="mt-8">
                <div className="px-4 py-4 rounded-3xl bg-white shadow-2xl">
                  <div className="py-2">Icon</div>

                  <div>
                    <h3 className="font-semibold">Easy</h3>
                    <div className="">Description</div>
                  </div>
                </div>
              </div>
            </animated.div>

            <div className=""></div>
          </>
        ) : (
          <animated.div style={style} className="flex-grow text-center">
            <div className="w-full max-w-lg mx-auto py-6 rounded-3xl shadow-2xl">
              <div className="font-bold text-3xl my-6">Signin</div>
              <Link href="/dashboard">View Demo</Link>
              <hr className="my-4" />
              <Link href="/signup">Create Account</Link>
            </div>
          </animated.div>
        )
      )}
    </section>
  );
};

export default Home;
