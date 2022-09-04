import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Reader from "../components/Reader";
import { ReaderProvider, useReaderContext } from "../context/readerContext";

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReaderProvider>
        <div className="flex flex-row flex-nowrap h-full">
          <Aside />

          <main className="flex-grow bg-[#f9f9f9] relative">
            <Reader />
            <Component {...pageProps} />
          </main>
        </div>
      </ReaderProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
