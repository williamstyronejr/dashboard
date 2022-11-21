"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PageHeader = () => {
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.body.classList.add("dark");
      setTheme("dark");
    } else {
      document.body.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  return (
    <header className="flex flex-row flex-nowrap justify-between py-2 px-4 border-b border-black/10 dark:border-white/10 bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark">
      <div className="flex flex-row flex-nowrap flex-grow max-w-xs mr-4 bg-custom-bg-off-light dark:bg-custom-bg-off-dark py-2 px-4 items-center rounded-lg">
        <i className="fas fa-search mr-4 shrink-0" />

        <input
          className="bg-transparent flex-grow outline-none"
          type="text"
          value={input}
          onChange={(evt) => setInput(evt.target.value)}
          onKeyDown={(evt) => {
            if (evt.key === "Enter") {
              router.push(`/search?q=${evt.currentTarget.value}`);
            }
          }}
          placeholder="Search"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          if (theme === "light") {
            document.body.classList.add("dark");
            setTheme("dark");
          } else {
            document.body.classList.remove("dark");
            setTheme("light");
          }
        }}
      >
        {theme === "light" ? (
          <i className="fas fa-sun text-2xl" />
        ) : (
          <i className="fas fa-moon text-2xl" />
        )}
      </button>
    </header>
  );
};

export default PageHeader;
