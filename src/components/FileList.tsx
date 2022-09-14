import { FC } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useState } from "react";
import { useReaderContext } from "../context/readerContext";
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

function capitalizeFirst(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

const FileList: FC<{
  queryUrl: string;
  heading: string;
  queryParams?: string;
}> = ({ queryUrl, heading, queryParams = "" }) => {
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
          queryClient.invalidateQueries(["media", queryUrl]);
        }
      },
    }
  );

  const { isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, data } =
    useInfiniteQuery(
      ["media", queryUrl],
      async ({ pageParam = 0 }) => {
        const res = await fetch(
          `${queryUrl}?page=${pageParam}&limit=10&${queryParams}`
        );
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

  console.log(preview);

  return (
    <>
      <div className="flex flex-col flex-nowrap h-full flex-grow">
        <header className="flex flex-row flex-nowrap mx-6 py-2 border-b border-black/10 dark:border-white/10 ">
          <h2 className="flex-grow font-extrabold text-3xl pb-8">
            {heading ? capitalizeFirst(heading) : ""}
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
                ? "grid grid-cols-[repeat(auto-fill,_minmax(260px,_1fr))]"
                : "flex flex-col divide-y"
            } flex-grow w-0 relative overflow-y-auto`}
          >
            {data && data.pages
              ? data.pages.map((page) =>
                  page.results.map((file) => (
                    <li
                      key={`type-${file.id}`}
                      className={`block ${
                        listMode === "grid" ? "m-4" : "mt-4"
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
                        <div
                          className={`block relative ${
                            listMode === "grid" ? "w-full" : "w-48"
                          } h-48 mx-auto shrink-0`}
                        >
                          {file.type === "story" ? (
                            <Image
                              className="rounded-lg"
                              priority={true}
                              layout="fill"
                              objectFit="contain"
                              src={
                                file.CollectionMedia[0].media.originalLink ||
                                file.CollectionMedia[0].media.originalLink
                              }
                              alt="Media Preview"
                            />
                          ) : null}
                          {file.type === "image" ? (
                            <Image
                              className="rounded-lg"
                              priority={true}
                              layout="fill"
                              objectFit="contain"
                              src={file.originalLink || file.link}
                              alt="Media Preview"
                            />
                          ) : null}
                        </div>

                        <div
                          className={`${
                            listMode === "grid"
                              ? "whitespace-nowrap text-ellipsis overflow-hidden text-sm"
                              : "ml-4"
                          }`}
                        >
                          {file.title || file.fileName}

                          {file.entity && file.entity.EntityTag ? (
                            <ul
                              className={`${
                                listMode === "grid"
                                  ? "hidden"
                                  : "flex flex-row flex-wrap"
                              }`}
                            >
                              {file.entity.EntityTag.map((entityTag) => (
                                <li
                                  key={`tag-${file.id}-${entityTag.tag.id}`}
                                  className="bg-sky-500 rounded py-2 px-4 mr-4 mb-4"
                                >
                                  {capitalizeFirst(entityTag.tag.name)}
                                </li>
                              ))}
                            </ul>
                          ) : null}
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
            {data && data.pages && data.pages[0].results.length === 0 ? (
              <li className="flex w-full h-full absolute top-0 left-0 items-center justify-center">
                No Media
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <aside
        className={`flex flex-col flex-nowrap h-full py-4 bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark ${
          preview
            ? "w-72 px-2 absolute z-10 right-0 md:relative bg-white"
            : "w-0"
        }`}
      >
        {preview ? (
          <>
            <div className="relative text-right shrink-0">
              <button
                className="inline mr-4 text-xl"
                type="button"
                onClick={() => setDeleteMenu(!deleteMenu)}
              >
                <i className="fas fa-trash-alt" />
              </button>

              <button
                className="inline mr-4 text-xl"
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

            <div className="py-4 px-2 flex-grow overflow-y-auto">
              <div className="relative w-full h-48">
                {preview.type === "image" ? (
                  <Image
                    className="rounded-lg"
                    priority={true}
                    layout="fill"
                    objectFit="contain"
                    src={preview.originalLink || preview.link}
                    alt="Book covers"
                  />
                ) : null}

                {preview.type === "story" ? (
                  <Image
                    className="rounded-lg"
                    priority={true}
                    layout="fill"
                    objectFit="contain"
                    src={
                      preview.CollectionMedia[0].media.originalLink ||
                      preview.CollectionMedia[0].media.originalLink
                    }
                    alt="Media Preview"
                  />
                ) : null}
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
    </>
  );
};

export default FileList;
