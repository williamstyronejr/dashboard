"use client";
import { FC, MouseEvent, useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import dayjs from "dayjs";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useRouter } from "next/navigation";
import { useSpring, animated } from "@react-spring/web";
import Modal from "./Modal";
import Preview from "./Preview";
import {
  convertSize,
  capitalizeFirst,
  isInArray,
  deleteOrInsert,
} from "../utils/utils";

const FileList: FC<{
  queryUrl: string;
  heading: string;
  queryParams?: string;
}> = ({ queryUrl, heading, queryParams = "" }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [listMode, setListMode] = useState("grid");
  const [infoVisible, setInfoVisible] = useState(false);
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [optionsMenu, setOptionsMenu] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState<Array<any>>([]);
  const [springsStyles, springApi] = useSpring(() => {
    from: {
      width: "0px";
    }
  });

  const handleClick = () => {
    springApi.start({
      from: {
        width: "1px",
      },
      to: {
        width: "100px",
      },
      reverse: infoVisible,
    });
  };

  // Close all headers menu when selected files change
  useEffect(() => {
    if (selectedFiles.length === 0) {
      setOptionsMenu(false);
      setDeleteMenu(false);
    }
  }, [selectedFiles]);

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
          setDeleteMenu(false);
          queryClient.invalidateQueries(["media", queryUrl]);
        }
      },
    }
  );

  const { mutate: updateFavorite, isLoading: isUpdating } = useMutation(
    ["favorite"],
    async ({ entityId, deleting }: { entityId: string; deleting: boolean }) => {
      const res = await fetch("/api/favorites", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entityId, deleting }),
        method: "POST",
      });

      const body = await res.json();
      return body;
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          setDeleteMenu(false);
          queryClient.invalidateQueries(["media", queryUrl]);
        }
      },
    }
  );

  const {
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    data,
    isError,
    error,
  } = useInfiniteQuery(
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

  const selectHandler = (evt: MouseEvent, file: any) => {
    if (evt.ctrlKey || evt.altKey) {
      setSelectedFiles(deleteOrInsert(selectedFiles, file));
    } else {
      setSelectedFiles([file]);
    }
  };

  console.log(selectedFiles);

  return (
    <div className="flex flex-col flex-nowrap h-full flex-grow">
      <Preview preview={preview} onClose={() => setPreview(null)} />
      <header className="flex flex-row flex-nowrap mx-6 py-2 border-b border-black/10 dark:border-white/10 ">
        <h2
          title={heading || ""}
          className="flex-grow w-0 font-extrabold text-3xl mr-10 whitespace-nowrap text-ellipsis overflow-x-hidden"
        >
          {heading ? capitalizeFirst(heading) : ""}
        </h2>

        {selectedFiles.length ? (
          <div className="mr-6 pr-6 border-r">
            <div className="text-xl">
              <button
                className="mr-4"
                type="button"
                onClick={() => setDeleteMenu(!deleteMenu)}
              >
                <i className="fas fa-trash-alt" />
              </button>

              {deleteMenu ? (
                <Modal
                  onClose={() => setDeleteMenu(false)}
                  onSuccess={() =>
                    deleteEntity(
                      selectedFiles.reduce(
                        (prev, curr) =>
                          prev === ""
                            ? curr.entityId
                            : `${prev},${curr.entityId}`,
                        ""
                      )
                    )
                  }
                >
                  <div>Are you sure you want to delete?</div>
                </Modal>
              ) : null}

              <button
                type="button"
                className=""
                onClick={() => {
                  setOptionsMenu(!optionsMenu);
                }}
              >
                +
              </button>

              {optionsMenu ? (
                <div className="absolute bg-custom-bg-light dark:bg-custom-bg-dark py-2 px-4">
                  <button type="button" className="">
                    Create Collection
                  </button>
                  <button type="button">Download</button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="">
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

          <button
            className="text-xl ml-4"
            type="button"
            onClick={() => {
              handleClick();
              setInfoVisible((old) => !old);
            }}
          >
            <i className="fas fa-info-circle" />
          </button>
        </div>
      </header>

      <div className="flex flex-row flex-nowrap relative w-full flex-grow h-0">
        <div className="flex flex-row flex-nowrap h-full overflow-y-auto flex-grow">
          <ul
            className={`${
              listMode === "grid"
                ? "grid grid-cols-[repeat(auto-fill,_minmax(260px,_1fr))]"
                : "flex flex-col divide-y"
            } flex-grow w-0 relative overflow-y-auto px-6`}
            onClick={(evt) => {
              if (evt.currentTarget === evt.target) setSelectedFiles([]);
            }}
          >
            {data && data.pages
              ? data.pages.map((page) =>
                  page.results.map((file) => (
                    <li
                      key={`type-${file.id}`}
                      className={`block group relative ${
                        listMode === "grid" ? "m-4" : "mt-4"
                      } `}
                    >
                      <button
                        className="hidden group-hover:block absolute top-1 left-1 z-10 hover:bg-slate-500 rounded-full py-2 px-3"
                        type="button"
                        onClick={() =>
                          updateFavorite({
                            entityId: file.entityId,
                            deleting: !!file.entity.Favorite,
                          })
                        }
                      >
                        {file.entity.Favorite ? (
                          <i className="fas fa-heart" />
                        ) : (
                          <i className="far fa-heart" />
                        )}
                      </button>

                      <button
                        className={`w-full border-2 p-1 border-transparent rounded-lg ${
                          selectedFiles.length &&
                          isInArray(selectedFiles, file.id)
                            ? "border-cyan-600"
                            : ""
                        } ${
                          listMode === "grid"
                            ? ""
                            : "flex flex-row flex-nowrap py-4"
                        }`}
                        type="button"
                        onClick={(evt) => selectHandler(evt, file)}
                        onDoubleClick={() => {
                          if (file.link) return setPreview(file);
                          return router.push(`/collections/${file.id}`);
                        }}
                      >
                        <div
                          className={`block relative ${
                            listMode === "grid" ? "w-full" : "w-48"
                          } h-48 mx-auto shrink-0`}
                        >
                          {file.CollectionMedia ? (
                            <Image
                              fill
                              className="rounded-lg object-contain"
                              priority={true}
                              src={
                                file.CollectionMedia[0].media.originalLink ||
                                file.CollectionMedia[0].media.originalLink
                              }
                              alt="Media Preview"
                            />
                          ) : null}

                          {file.type === "video" ? (
                            <Image
                              fill
                              className="rounded-lg object-contain"
                              priority={true}
                              src={file.Photo.originalLink || file.Photo.link}
                              alt="Media Preview"
                            />
                          ) : null}

                          {file.type === "image" ? (
                            <Image
                              className="rounded-lg object-contain"
                              fill
                              priority={true}
                              src={file.originalLink || file.link}
                              alt="Media Preview"
                            />
                          ) : null}

                          {file.type === "audio" ? (
                            <Image
                              className="rounded-lg object-contain"
                              fill
                              priority={true}
                              src={
                                file.Photo ? file.Photo.link : "/audioIcon.png"
                              }
                              alt="Media Preview"
                            />
                          ) : null}
                        </div>

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
                        <div
                          className={`${
                            listMode === "grid"
                              ? "whitespace-nowrap text-ellipsis overflow-hidden text-sm"
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

            {!data && isError ? (
              <li className="flex w-full h-full absolute top-0 left-0 items-center justify-center">
                An error occurred getting your files, please try again later.
              </li>
            ) : null}
          </ul>
        </div>

        <animated.aside
          style={springsStyles}
          className={`flex flex-col flex-nowrap h-full absolute z-10 right-0 md:relative  bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark 
          `}
        >
          {/* // ${infoVisible ? "w-72" : "w-0"} */}
          {infoVisible && !selectedFiles.length ? <div></div> : null}

          {infoVisible && selectedFiles.length ? (
            <>
              <div className="relative text-right shrink-0 py-2">
                <button
                  className="inline mr-4 px-3 py-1 text-xl rounded-full transition hover:bg-custom-bg-btn-hover"
                  type="button"
                  title="Close Info"
                  onClick={() => setInfoVisible(false)}
                >
                  X
                </button>
              </div>

              <div className="py-4 px-2 flex-grow h-0 overflow-y-auto">
                <div className="relative w-full h-48">
                  {selectedFiles.length === 1 &&
                  selectedFiles[0].type === "image" ? (
                    <Image
                      fill
                      className="rounded-lg object-contain"
                      priority={true}
                      src={
                        selectedFiles[0].originalLink || selectedFiles[0].link
                      }
                      alt="Book covers"
                    />
                  ) : null}

                  {selectedFiles.length === 1 &&
                  selectedFiles[0].type === "story" ? (
                    <Image
                      fill
                      className="rounded-lg object-contain"
                      priority={true}
                      src={
                        selectedFiles[0].CollectionMedia[0].media
                          .originalLink ||
                        selectedFiles[0].CollectionMedia[0].media.originalLink
                      }
                      alt="Media Preview"
                    />
                  ) : null}

                  {selectedFiles.length > 1 ? (
                    <div className="">MultiFiles</div>
                  ) : null}
                </div>

                <div className="mt-4">
                  {selectedFiles.length === 1
                    ? selectedFiles[0].title
                    : `${selectedFiles.length} Selected`}
                </div>

                <hr className="my-4" />

                {selectedFiles.length === 1 ? (
                  <div className="">
                    {selectedFiles[0].entity &&
                    selectedFiles[0].entity.EntityTag ? (
                      <div className="mt-2 w-full">
                        <ul className="flex flex-row flex-wrap px-2">
                          {selectedFiles[0].entity.EntityTag.map(
                            (entityTag) => (
                              <li
                                key={`tag-${selectedFiles[0].id}-${entityTag.tag.id}`}
                                className="bg-sky-500 rounded p-2 mr-4 mb-4 text-xs"
                              >
                                {capitalizeFirst(entityTag.tag.name)}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ) : null}

                    <div className="flex flex-row flex-nowrap my-2">
                      <div className="w-3/6 text-gray-500">Size</div>
                      <div className="w-3/6 text-right">
                        {convertSize(selectedFiles[0].size)}
                      </div>
                    </div>

                    <div className="flex flex-row flex-nowrap my-2">
                      <div className="w-3/6 text-gray-500">Create</div>{" "}
                      <div className="w-3/6 text-right">
                        {dayjs(selectedFiles[0].createdAt).format(
                          "MMM DD, YYYY"
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row flex-nowrap my-2">
                      <div className="w-3/6 text-gray-500">Modified</div>{" "}
                      <div className="w-3/6 text-right">
                        {dayjs(selectedFiles[0].updatedAt).format(
                          "MMM DD, YYYY"
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-row flex-nowrap my-2">
                      <div className="w-3/6 text-gray-500">Size </div>
                      <div className="w-3/6 text-right">
                        {convertSize(
                          selectedFiles.reduce(
                            (prev, curr) =>
                              curr.size ? curr.size + prev : prev,
                            0
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </animated.aside>
      </div>
    </div>
  );
};

export default FileList;
