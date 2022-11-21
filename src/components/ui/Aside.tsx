"use client";
import { useState } from "react";
import Link from "next/link";
import { useReaderContext } from "../../context/readerContext";

const Aside = () => {
  const { state, setSelected } = useReaderContext();
  const [menu, setMenu] = useState(true);

  return (
    <aside
      className={`relative h-full shrink-0 pt-6 w-16 border-r border-black/10 dark:border-white/10 bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark 
      ${menu ? "md:w-52" : "md:w-16"}`}
    >
      <div
        className={`absolute ${
          menu ? "block" : "hidden"
        } md:hidden top-0 left-0 w-screen h-screen bg-black/80 z-40`}
      />

      <div
        className={`flex flex-col flex-nowrap h-full z-50 absolute md:relative top-0 left-0 dark:border-white/10 bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark ${
          menu ? "w-52" : "w-16"
        }`}
      >
        <nav className={`${menu ? "block" : "hidden"} `}>
          <ul className="pl-6 text-lg">
            <li className="mb-2">
              <Link href="/dashboard" className="">
                <span className="mr-4">
                  <i className="fas fa-file" />
                </span>
                Dashboard
              </Link>
            </li>

            <li className="mb-2">
              <Link href="/collections" className="">
                <span className="mr-4">
                  <i className="fas fa-folder" />
                </span>
                Folders
              </Link>
            </li>

            <li className="mb-2">
              <Link href="/media/audio" className="">
                <span className="mr-4">
                  <i className="fas fa-file-audio" />
                </span>
                Audio
              </Link>
            </li>

            <li className="mb-2">
              <Link href="/media/video" className="">
                <span className="mr-4">
                  <i className="fas fa-file-video" />
                </span>
                Videos
              </Link>
            </li>

            <li className="mb-2">
              <Link href="/media/image" className="">
                <span className="mr-4">
                  <i className="fas fa-file-image" />
                </span>
                Photos
              </Link>
            </li>

            <li className="">
              <Link href="/favorites" className="">
                <span className="mr-4">
                  <i className="fas fa-star" />
                </span>
                Favorites
              </Link>
            </li>
          </ul>
        </nav>

        <hr className="my-6 shrink-0" />

        <div className="flex-grow h-0 overflow-y-auto">
          <ul className="w-full">
            {state.list.map((item, i) => (
              <li
                key={`reader-${item.id}`}
                className={`w-full px-2 ${
                  state.selected !== null &&
                  state.list[state.selected].id === item.id
                    ? "bg-[#dbdbdb] dark:bg-[#272727]"
                    : ""
                } rounded`}
              >
                <button
                  className=" w-full py-2"
                  onClick={() => {
                    setSelected(state.selected === i ? null : i);
                  }}
                >
                  <div className="w-full whitespace-nowrap text-ellipsis overflow-hidden ">
                    <span className="">
                      {item.loading ? (
                        <i className="fas fa-spinner mx-2 animate-spin" />
                      ) : null}
                    </span>

                    {item.title}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="block mx-auto text-2xl shrink-0 my-2"
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
      </div>
    </aside>
  );
};

export default Aside;
