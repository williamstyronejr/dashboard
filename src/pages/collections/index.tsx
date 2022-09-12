import { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useReaderContext } from "../../context/readerContext";

const CollectionPage: NextPage = () => {
  const [listMode, setListMode] = useState("list");
  const { AddItemToList } = useReaderContext();

  const { isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, data } =
    useInfiniteQuery(
      ["collections"],
      async ({ pageParam = 0 }) => {
        const res = await fetch(`/api/collection?page=${pageParam}&limit=10`);
        const body = await res.json();
        return body;
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
        keepPreviousData: true,
      }
    );

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading || isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: false,
    rootMargin: "0px 0px 200px 0px",
  });

  return (
    <section className="h-screen overflow-y-auto py-2 px-4 bg-custom-bg-off-light dark:bg-custom-bg-off-dark text-custom-text-light dark:text-custom-text-dark">
      <header className="flex flex-row flex-nowrap mb-2">
        <h2 className="flex-grow text-xl font-semibold">Collections</h2>

        <button
          className="text-xl"
          type="button"
          onClick={() => setListMode(listMode === "grid" ? "list" : "grid")}
        >
          {listMode === "grid" ? (
            <i className="fas fa-list" />
          ) : (
            <i className="fas fa-th-large" />
          )}
        </button>
      </header>

      <div>
        <ul
          className={`${
            listMode === "grid" ? "flex flex-row flex-wrap" : "flex flex-col"
          }`}
        >
          {data && data.pages
            ? data.pages.map((page) =>
                page.collections.map((file) => (
                  <li
                    key={`type-${file.id}`}
                    className={`block ${
                      listMode === "grid" ? "w-4/12 mt-4" : "w-full"
                    } `}
                  >
                    <button
                      className={
                        listMode === "list"
                          ? "flex flex-row flex-nowrap items-center"
                          : ""
                      }
                      type="button"
                      onClick={() => AddItemToList(file.id, file.title)}
                    >
                      <div className="relative w-32 h-48 mx-auto">
                        <Image
                          className="rounded-lg"
                          priority={true}
                          layout="fill"
                          src={file.CollectionMedia[0].media.originalLink}
                          alt="Collection Preview"
                        />
                      </div>

                      <div
                        className={
                          listMode === "grid" ? "text-center" : "text-left ml-4"
                        }
                      >
                        {file.title}
                        <ul
                          className={
                            listMode === "list"
                              ? "flex flex-row flex-wrap"
                              : "hidden"
                          }
                        >
                          {file.entity.EntityTag.map((entityTag) => (
                            <li
                              key={`tag-${file.id}-${entityTag.tag.id}`}
                              className="bg-sky-500 rounded py-2 px-4 mr-4"
                            >
                              {entityTag.tag.name.toUpperCase()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </button>
                  </li>
                ))
              )
            : null}

          {hasNextPage ? (
            <li className="h-40" ref={sentryRef}>
              <i className="fas fa-spinner" />
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
};

export default CollectionPage;
