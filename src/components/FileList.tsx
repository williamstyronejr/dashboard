import { FC, MouseEvent, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import dayjs from "dayjs";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useReaderContext } from "../context/readerContext";
import {
  convertSize,
  capitalizeFirst,
  isInArray,
  deleteOrInsert,
} from "../utils/utils";
import Modal from "./Modal";
import Preview from "../components/Preview";

const FileList: FC<{
  queryUrl: string;
  heading: string;
  queryParams?: string;
}> = ({ queryUrl, heading, queryParams = "" }) => {
  const queryClient = useQueryClient();
  const [listMode, setListMode] = useState("grid");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Array<any>>([]);
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

      console.log("Made it here");
      if (res.status === 500) throw new Error();
      const body = await res.json();
      return body;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
      keepPreviousData: true,
    }
  );

  console.log();
  console.log({ isError });
  console.log({ error });
  const [sentryRef] = useInfiniteScroll({
    loading: isLoading || isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onLoadMore: fetchNextPage,
    disabled: false,
    rootMargin: "0px 0px 200px 0px",
  });

  const selectHandler = (evt: MouseEvent, file: any) => {
    if (evt.ctrlKey) {
      setSelectedFiles(deleteOrInsert(selectedFiles, file));
    } else {
      setSelectedFiles([file]);
    }
  };

  return (
    <div className="flex flex-col flex-nowrap h-full flex-grow">
      <header className="flex flex-row flex-nowrap mx-6 py-2 border-b border-black/10 dark:border-white/10 ">
        <h2 className="flex-grow font-extrabold text-3xl">
          {heading ? capitalizeFirst(heading) : ""}
        </h2>

        {preview ? (
          <div className="mr-6 pr-6 border-r">
            <div className="relative">
              <button
                className="text-xl"
                type="button"
                onClick={() => setDeleteMenu(!deleteMenu)}
              >
                <i className="fas fa-trash-alt" />
              </button>

              {deleteMenu ? (
                <Modal
                  onClose={() => setDeleteMenu(false)}
                  onSuccess={() => deleteEntity(preview.entityId)}
                >
                  <div>Are you sure you want to delete?</div>
                </Modal>
              ) : null}

              <div
                className={`${
                  deleteMenu ? "block" : "hidden"
                } absolute z-30 bg-sky-500 rounded-lg right-1 w-40 py-4 text-left`}
              >
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
              setPreviewVisible((old) => !old);
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
                      className={`block ${
                        listMode === "grid" ? "m-4" : "mt-4"
                      } `}
                    >
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

            {!data && isError ? (
              <li className="flex w-full h-full absolute top-0 left-0 items-center justify-center">
                An error occurred getting your files, please try again later.
              </li>
            ) : null}
          </ul>
        </div>

        <aside
          className={`flex flex-col flex-nowrap h-full absolute z-10 right-0 md:relative  bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark ${
            previewVisible ? "w-72" : "w-0"
          }`}
        >
          {previewVisible && !selectedFiles.length ? <div></div> : null}

          {previewVisible && selectedFiles.length ? (
            <>
              <div className="relative text-right shrink-0">
                <button
                  className="inline mr-4 text-xl"
                  type="button"
                  onClick={() => setPreviewVisible(false)}
                >
                  X
                </button>
              </div>

              <div className="py-4 px-2 flex-grow h-0 overflow-y-auto">
                <div className="relative w-full h-48">
                  {selectedFiles.length === 1 &&
                  selectedFiles[0].type === "image" ? (
                    <Image
                      className="rounded-lg"
                      priority={true}
                      layout="fill"
                      objectFit="contain"
                      src={
                        selectedFiles[0].originalLink || selectedFiles[0].link
                      }
                      alt="Book covers"
                    />
                  ) : null}

                  {selectedFiles.length === 1 &&
                  selectedFiles[0].type === "story" ? (
                    <Image
                      className="rounded-lg"
                      priority={true}
                      layout="fill"
                      objectFit="contain"
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
                    <div className="flex flex-row flex-nowrap">
                      <div className="text-gray-500 my-1">Size</div>
                      <div className="my-1">
                        {convertSize(selectedFiles[0].size)}
                      </div>
                    </div>

                    <div className="flex flex-row flex-nowrap">
                      <div className="text-gray-500 my-1">Create</div>{" "}
                      <div className="my-1">
                        {dayjs(selectedFiles[0].createdAt).format(
                          "MMM DD, YYYY"
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row flex-nowrap">
                      <div className="text-gray-500 my-1">Modified</div>{" "}
                      <div className="my-1">
                        {dayjs(selectedFiles[0].updatedAt).format(
                          "MMM DD, YYYY"
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default FileList;
