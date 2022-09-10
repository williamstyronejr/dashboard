import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { NextPage } from "next";
import Image from "next/image";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useState } from "react";
import { useRouter } from "next/router";
import { useReaderContext } from "../../context/readerContext";
import dayjs from "dayjs";

function convertSize(fileSize: number) {
  return `${fileSize.toPrecision(2)} MB`;
}

const MediaPage: NextPage = () => {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const [listMode, setListMode] = useState("grid");
  const [preview, setPreview] = useState<any>(null);
  const [deleteMenu, setDeleteMenu] = useState(false);
  const { AddItemToList } = useReaderContext();

  const { mutate: deleteEntity, isLoading: isDeleting } = useMutation(
    ["delete"],
    async (entityId: string) => {
      const res = await fetch("/api/entity/delete", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entityId }),
        method: "DELETE",
      });

      const body = await res.json();
      return body;
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          setPreview(null);
          setDeleteMenu(false);
          queryClient.invalidateQueries(["media", query.type]);
        }
      },
    }
  );

  const { isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, data } =
    useInfiniteQuery(
      ["media", query.type],
      async ({ pageParam = 0 }) => {
        const res = await fetch(
          `/api/media/${query.type}?page=${pageParam}&limit=10`
        );
        const body = await res.json();
        return body;
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
        keepPreviousData: true,
        enabled: !!query.type,
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
    <section className="">
      <header className="w-full">
        <h2>{query.type?.toString().toUpperCase()}</h2>

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

      <div className="flex flex-row flex-nowrap overflow-y-auto">
        <ul
          className={`${
            listMode === "grid" ? "flex flex-row flex-wrap" : "flex flex-col"
          } flex-grow w-0`}
        >
          {data && data.pages
            ? data.pages.map((page) =>
                page.media.map((file) => (
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
                      onClick={() => setPreview(file)}
                      onDoubleClick={() => {
                        setPreview(null);
                        AddItemToList(file.id, file.title, file);
                      }}
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

          {query.type && hasNextPage ? (
            <li className="h-40" ref={sentryRef}>
              <i className="fas fa-spinner" />
            </li>
          ) : null}
        </ul>

        <aside className={`${preview ? "w-52" : "w-0"}`}>
          {preview ? (
            <>
              <button
                className=""
                type="button"
                onClick={() => setPreview(null)}
              >
                X
              </button>

              <button
                className=""
                type="button"
                onClick={() => setDeleteMenu(!deleteMenu)}
              >
                <i className="fas fa-trash-alt" />
              </button>

              <div className={`${deleteMenu ? "block" : "hidden"}`}>
                <div>Are you sure you want to delete?</div>

                <button
                  className=""
                  type="button"
                  onClick={() => deleteEntity(preview.entityId)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <i className="fas fa-spinner animate-spin mr-2" />
                      <span>Deleting</span>
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>

              <div className="py-4 px-2">
                <div className="relative w-full h-20">
                  <Image
                    className="rounded-lg"
                    priority={true}
                    layout="fill"
                    src={preview.Photo ? "" : ""}
                    alt="Book covers"
                  />
                </div>

                <div className="mt-4">{preview.title}</div>
                <hr className="my-4" />

                <div className="flex flex-row flex-nowrap">
                  <div className="mr-2">
                    <div className="text-gray-500 my-1">Size</div>
                    <div className="text-gray-500 my-1">Create</div>
                    <div className="text-gray-500 my-1">Modified</div>
                  </div>

                  <div>
                    <div className="my-1">{convertSize(preview.size)}</div>
                    <div className="my-1">
                      {dayjs(preview.createdAt).format("MMM DD, YYYY")}
                    </div>
                    <div className="my-1">
                      {dayjs(preview.updatedAt).format("MMM DD, YYYY")}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </aside>
      </div>
    </section>
  );
};

export default MediaPage;
