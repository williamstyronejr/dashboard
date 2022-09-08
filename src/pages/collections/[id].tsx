import { NextPage } from "next";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useReaderContext } from "../../context/readerContext";

const CollectionPage: NextPage = () => {
  const [listMode, setListMode] = useState("grid");
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
    <section className="h-screen overflow-y-auto">
      <header className="">
        <h2>Collections</h2>

        <button
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
                      listMode === "grid"
                        ? "w-4/12 mt-4"
                        : " flex flex-row flex-nowrap w-full"
                    } `}
                  >
                    <button
                      className=""
                      type="button"
                      onClick={() => AddItemToList(file.id, file.title, file)}
                    >
                      <div className="relative w-32 h-40">
                        <Image
                          className="rounded-lg"
                          priority={true}
                          layout="fill"
                          src={file.Photo ? "" : ""}
                          alt="Book covers"
                        />
                      </div>
                      <div>{file.title}</div>
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
