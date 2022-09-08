import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Reader from "../components/Reader";
import { ReaderProvider, useReaderContext } from "../context/readerContext";
import { useRouter } from "next/router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Aside = () => {
  const { state, setSelected } = useReaderContext();
  const [menu, setMenu] = useState(true);

  return (
    <aside
      className={`flex flex-col flex-nowrap shrink-0 ${menu ? "w-52" : "w-16"}`}
    >
      <nav className={`${menu ? "block" : "hidden"} `}>
        <ul className="pl-6">
          <li className="">
            <Link href="/">
              <a className="">
                <span className="mr-4">
                  <i className="fas fa-file" />
                </span>
                All Files
              </a>
            </Link>
          </li>

          <li className="">
            <Link href="/collections">
              <a className="">
                <span className="mr-4">
                  <i className="fas fa-folder" />
                </span>
                Folders
              </a>
            </Link>
          </li>

          <li className="">
            <Link href="/media/audio">
              <a className="">
                <span className="mr-4">
                  <i className="fas fa-file-audio" />
                </span>
                Audio
              </a>
            </Link>
          </li>

          <li className="">
            <Link href="/media/video">
              <a className="">
                <span className="mr-4">
                  <i className="fas fa-file-video" />
                </span>
                Videos
              </a>
            </Link>
          </li>

          <li className="">
            <Link href="/media/photos">
              <a className="">
                <span className="mr-4">
                  <i className="fas fa-file-image" />
                </span>
                Photos
              </a>
            </Link>
          </li>

          <li className="">
            <Link href="/list/favorites">
              <a className="">
                <span className="mr-4">
                  <i className="fas fa-star" />
                </span>
                Favorites
              </a>
            </Link>
          </li>
        </ul>
      </nav>

      <hr className="my-6 shrink-0" />

      <div>
        <ul>
          {state.list.map((item, i) => (
            <li key={`reader-${item.id}`}>
              <button
                className=""
                onClick={() => {
                  setSelected(state.selected === i ? null : i);
                }}
              >
                <span className="">
                  {item.loading ? <i className="fas fa-spinner" /> : null}
                </span>

                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="block mx-auto text-2xl shrink-0"
        type="button"
        onClick={() => {
          setMenu(!menu);
        }}
      >
        {menu ? (
          <i className="fas fa-chevron-left" />
        ) : (
          <i className="fas fa-chevron-right" />
        )}
      </button>
    </aside>
  );
};

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
    <header className="flex flex-row flex-nowrap justify-between bg-white py-2 px-4">
      <div className="flex flex-row flex-nowrap flex-grow max-w-xs bg-custom-bg-off-light dark:bg-custom-bg-off-dark py-2 px-4 items-center rounded-lg">
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReaderProvider>
        <div className="flex flex-row flex-nowrap h-full">
          <Aside />

          <main className="flex flex-col flex-nowrap flex-grow bg-[#f9f9f9] relative w-0">
            <Reader />

            <PageHeader />
            <Component {...pageProps} />
          </main>
        </div>
      </ReaderProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
