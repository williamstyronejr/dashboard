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
  const kiloBytes = fileSize / 1000;
  if (kiloBytes < 1024) {
    return `${kiloBytes.toFixed(2)} KB`;
  } else if (kiloBytes % (1024 * 1024) !== kiloBytes) {
    return `${(kiloBytes / (1024 * 1024)).toFixed(2)} GB`;
  }
  return `${(kiloBytes / 1024).toFixed(2)} MB`;
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
    <section className="flex flex-row flex-nowrap h-0 flex-grow bg-custom-bg-off-light dark:bg-custom-bg-off-dark text-custom-text-light dark:text-custom-text-dark">
      <div className="flex flex-col flex-nowrap h-full flex-grow">
        <header className="flex flex-row flex-nowrap mx-6 py-2 border-b border-black/10 dark:border-white/10 ">
          <h2 className="flex-grow font-extrabold text-3xl pb-8">
            {query.type
              ? `${query.type.toString().charAt(0).toUpperCase()}${query.type
                  .toString()
                  .slice(1)}`
              : ""}
          </h2>

          <button
            className="text-xl "
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

        <div className="flex flex-row flex-nowrap overflow-y-auto h-0 flex-grow">
          <ul
            className={`px-6 ${
              listMode === "grid"
                ? "flex flex-row flex-wrap"
                : "flex flex-col divide-y"
            } flex-grow w-0 overflow-y-auto`}
          >
            {data && data.pages
              ? data.pages.map((page) =>
                  page.media.map((file) => (
                    <li
                      key={`type-${file.id}`}
                      className={`block ${
                        listMode === "grid" ? "w-4/12 mt-4" : "mt-4"
                      } `}
                    >
                      <button
                        className={`w-full ${
                          listMode === "grid"
                            ? ""
                            : "flex flex-row flex-nowrap py-4"
                        }`}
                        type="button"
                        onClick={() => setPreview(file)}
                        onDoubleClick={() => {
                          setPreview(null);
                          AddItemToList(file.id, file.title, file);
                        }}
                      >
                        {file.type === "image" ? (
                          <div className="relative w-32 h-40 mx-auto shrink-0">
                            <Image
                              className="rounded-lg"
                              priority={true}
                              layout="fill"
                              src={file.originalLink || file.link}
                              alt="Book covers"
                            />
                          </div>
                        ) : null}

                        <div
                          className={`${
                            listMode === "grid"
                              ? "whitespace-nowrap text-ellipsis overflow-hidden"
                              : "ml-4"
                          }`}
                        >
                          {file.title || file.fileName}
                        </div>
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
        </div>
      </div>

      <aside
        className={`h-full overflow-y-auto py-4 ${
          preview ? "w-52 px-2" : "w-0"
        }`}
      >
        {preview ? (
          <>
            <div className="relative text-right">
              <button
                className="inline mr-4 text-xl"
                type="button"
                onClick={() => setDeleteMenu(!deleteMenu)}
              >
                <i className="fas fa-trash-alt" />
              </button>

              <button
                className="inline text-xl"
                type="button"
                onClick={() => setPreview(null)}
              >
                X
              </button>

              <div
                className={`${
                  deleteMenu ? "block" : "hidden"
                } absolute z-10 bg-sky-500 rounded-lg px-2 py-4 text-left`}
              >
                <div>Are you sure you want to delete?</div>

                <button
                  className="w-full"
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
            </div>

            <div className="py-4 px-2">
              {preview.type === "image" ? (
                <div className="relative w-full h-48">
                  <Image
                    className="rounded-lg"
                    priority={true}
                    layout="fill"
                    objectFit="contain"
                    src={preview.originalLink || preview.link}
                    alt="Book covers"
                  />
                </div>
              ) : null}

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
    </section>
  );
};

export default MediaPage;
