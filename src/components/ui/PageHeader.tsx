"use client";

import { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchBar } from "../../hooks/api/search";

const Search: FC<{}> = () => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const { data, loading } = useSearchBar(input);

  return (
    <div className="flex flex-row flex-nowrap flex-grow relative max-w-xs mr-4 bg-custom-bg-off-light dark:bg-custom-bg-off-dark py-2 px-4 items-center rounded-lg">
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

      <div className="absolute top-12 left-0 w-full rounded-lg z-20 bg-white">
        <div className="bg-custom-bg-light">
          <Link className="block p-4" href={`/search?q=${input}`}>
            View All Results
          </Link>
        </div>

        {data && data.collections ? (
          <div className="">
            <h3 className="border-y text-sm px-4 py-1">Collections</h3>
            <ul className="w-full px-4 divide-y">
              {data.collections.map((collection) => (
                <li
                  key={`search-collection-${collection.id}`}
                  className="py-4 whitespace-nowrap text-ellipsis overflow-hidden"
                >
                  <Link href={`/collections/${collection.id}`}>
                    {collection.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data && data.medias ? (
          <div className="">
            <h3 className="border-y text-sm px-4 py-1">Media</h3>

            <ul className="px-4">
              {data.medias.map((media) => (
                <li
                  key={`search-media-${media.id}`}
                  className="py-4 whitespace-nowrap text-ellipsis overflow-hidden"
                >
                  {media.title}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data && data.tags ? (
          <div className="">
            <h3 className="border-y text-sm px-4 py-1">Tags</h3>

            <ul className="flex flex-row flex-wrap px-4">
              {data.tags.map((tag) => (
                <li key={tag.id}>
                  <Link
                    className="block px-2 py-2 mr-2 my-2 rounded-lg bg-white hover:bg-slate-500"
                    href={`/search?tags=${tag.name}`}
                  >
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const PageHeader = () => {
  const [theme, setTheme] = useState("light");

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
      <Search />
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
