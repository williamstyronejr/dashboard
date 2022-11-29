"use client";
import {
  ChangeEvent,
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import Menu from "./ui/Menu";
import {
  convertSize,
  capitalizeFirst,
  isInArray,
  deleteOrInsert,
} from "../utils/utils";
import {
  useAddItemsToCollection,
  useCreateCollection,
  useSearchCollections,
} from "../hooks/api/media";

const HeaderButton: FC<{ children: ReactNode; onClick: () => void }> = ({
  children,
  onClick,
  ...restProps
}) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-full px-2 py-1 mx-1 hover:bg-slate-500/10"
    {...restProps}
  >
    {children}
  </button>
);

const AddToMenu: FC<{ selected: Array<any> }> = ({ selected }) => {
  const [visible, setVisible] = useState(false);
  const [createMenu, setCreateMenu] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState("");
  const [search, setSearch] = useState("");

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      if (evt.target.name === "search") {
        setSearch(evt.target.value);
      } else {
        setCollectionTitle(evt.target.value);
      }
    },
    [setSearch, setCollectionTitle]
  );

  const { data: collectionList } = useSearchCollections(search);
  const { mutate: addToCollection } = useAddItemsToCollection({
    onSettled: () => {
      setVisible(false);
    },
  });
  const { mutate: createCollection } = useCreateCollection({
    onSettled: () => {
      setVisible(false);
      setCreateMenu(false);
    },
  });

  useEffect(() => {
    if (selected.length === 0) setVisible(false);
  }, [selected]);

  return (
    <div className="inline-block relative">
      <HeaderButton onClick={() => setVisible((old) => !old)}>
        <i className="fas fa-images" />
      </HeaderButton>

      <Menu
        visible={visible}
        className="absolute w-48 z-20 py-2 -left-20 mt-4 shadow-custom-shadow-round rounded-md bg-custom-bg-light dark:bg-custom-bg-dark"
      >
        <div>
          <div className="relative">
            <button
              className={`${
                createMenu ? "block" : "hidden"
              } absolute left-3 -top-1 `}
              type="button"
              onClick={() => setCreateMenu(false)}
            >
              <i className="fas fa-chevron-left" />
            </button>
            <h3 className="text-center font-bold text-sm">Add Files To</h3>
            <hr className="mt-2" />
          </div>

          {!createMenu ? (
            <div className="w-full h-44 overflow-y-auto">
              <div className="mx-2">
                <input
                  className="w-full text-sm"
                  type="text"
                  name="search"
                  value={search}
                  onChange={onChange}
                />
              </div>

              <hr className="mt-1" />

              <button
                onClick={() => setCreateMenu((old) => !old)}
                type="button"
                className="w-full text-left px-2 py-2 whitespace-nowrap text-ellipsis overflow-hidden text-sm hover:bg-sky-500/10"
              >
                Create Collection
              </button>

              <hr />

              {collectionList
                ? collectionList.map(({ id, title }) => (
                    <button
                      className="w-full text-left px-2 py-2 whitespace-nowrap text-ellipsis overflow-hidden text-sm hover:bg-sky-500/10"
                      key={`add-item-to-${id}`}
                      type="button"
                      onClick={() => {
                        addToCollection({
                          id,
                          mediaIds: selected.map((media) => media.id).join(","),
                        });
                      }}
                    >
                      {title}
                    </button>
                  ))
                : null}
            </div>
          ) : (
            <div className="flex flex-col flex-nowrap w-full h-44 px-2 text-base justify-between">
              <input
                className="w-full px-2 mt-2 text-base"
                value={collectionTitle}
                onChange={onChange}
                placeholder="New Collection Name"
              />

              <div className="flex flex-row flex-nowrap justify-around">
                <button
                  className=""
                  type="button"
                  onClick={() => {
                    if (collectionTitle.trim() === "") return;
                    createCollection({
                      title: collectionTitle,
                      mediaIds: selected.map((media) => media.id).join(","),
                    });
                  }}
                >
                  Create
                </button>

                <button
                  className=""
                  type="button"
                  onClick={() => setCreateMenu((old) => !old)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Menu>
    </div>
  );
};

const AsideVideo: FC<{ link: string }> = ({ link }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <div className=" group-hover: flex justify-center items-center h-full w-full absolute top-0 left-0">
        <button
          className="z-10 rounded-full px-3 py-2 text-white bg-black/60 hover:bg-black/80 border-slate-100 border-2"
          type="button"
          onClick={() => {
            if (videoRef.current?.paused) {
              videoRef.current.play();
              setIsPlaying(true);
            } else {
              videoRef.current?.pause();
              setIsPlaying(false);
            }
          }}
        >
          {isPlaying ? (
            <i className="fas fa-play" />
          ) : (
            <i className="fas fa-pause" />
          )}
        </button>
      </div>

      <video ref={videoRef} loop className="w-full h-full" src={link} />
    </>
  );
};

const AsideDetails: FC<{
  selected: Array<any>;
  visible: boolean;
  onClose: Function;
}> = ({ visible, selected, onClose }) => {
  const springsStyles = useSpring({
    from: { width: "1px" },
    to: { width: "300px" },
    reverse: !visible,
    reset: false,
  });

  // const handleClick = () => {
  //   springApi.start({
  //     from: {
  //       width: "1px",
  //     },
  //     to: {
  //       width: "200px",
  //     },
  //     reverse: visible,
  //     reset: false,
  //   });
  // };

  return (
    <animated.aside
      style={springsStyles}
      className={`flex flex-col flex-nowrap h-full absolute z-10 right-0 md:relative  bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark 
      `}
    >
      {/* // ${infoVisible ? "w-72" : "w-0"} */}
      {visible && !selected.length ? <div></div> : null}

      {visible && selected.length ? (
        <>
          <div className="relative text-right shrink-0 py-2">
            <button
              className="inline mr-4 px-3 py-1 text-xl rounded-full transition hover:bg-custom-bg-btn-hover"
              type="button"
              title="Close Info"
              onClick={() => onClose(false)}
            >
              X
            </button>
          </div>

          <div className="py-4 px-2 flex-grow h-0 overflow-y-auto">
            <div className="group relative w-full h-60">
              {selected.length === 1 && selected[0].type === "image" ? (
                <Image
                  fill
                  className="rounded-lg object-contain"
                  priority={true}
                  src={selected[0].originalLink || selected[0].link}
                  alt="Book covers"
                />
              ) : null}

              {selected.length === 1 && selected[0].type === "video" ? (
                <AsideVideo
                  link={selected[0].originalLink || selected[0].link}
                />
              ) : null}

              {selected.length === 1 && selected[0].CollectionMedia ? (
                <Image
                  fill
                  className="rounded-lg object-contain"
                  priority={true}
                  src={
                    selected[0].CollectionMedia[0].media.originalLink ||
                    selected[0].CollectionMedia[0].media.originalLink
                  }
                  alt="Media Preview"
                />
              ) : null}

              {selected.length > 1 ? <div className="">MultiFiles</div> : null}
            </div>

            <div className="mt-4">
              {selected.length === 1
                ? selected[0].title
                : `${selected.length} Selected`}
            </div>

            <hr className="my-4" />

            {selected.length === 1 ? (
              <div className="">
                {selected[0].entity && selected[0].entity.EntityTag ? (
                  <div className="mt-2 w-full">
                    <ul className="flex flex-row flex-wrap px-2">
                      {selected[0].entity.EntityTag.map((entityTag) => (
                        <li
                          key={`tag-${selected[0].id}-${entityTag.tag.id}`}
                          className="bg-sky-500 rounded p-2 mr-4 mb-4 text-xs"
                        >
                          {capitalizeFirst(entityTag.tag.name)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="flex flex-row flex-nowrap my-2">
                  <div className="w-3/6 text-gray-500">Size</div>
                  <div className="w-3/6 text-right">
                    {convertSize(selected[0].size)}
                  </div>
                </div>

                <div className="flex flex-row flex-nowrap my-2">
                  <div className="w-3/6 text-gray-500">Create</div>{" "}
                  <div className="w-3/6 text-right">
                    {dayjs(selected[0].createdAt).format("MMM DD, YYYY")}
                  </div>
                </div>

                <div className="flex flex-row flex-nowrap my-2">
                  <div className="w-3/6 text-gray-500">Modified</div>{" "}
                  <div className="w-3/6 text-right">
                    {dayjs(selected[0].updatedAt).format("MMM DD, YYYY")}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-row flex-nowrap my-2">
                  <div className="w-3/6 text-gray-500">Size </div>
                  <div className="w-3/6 text-right">
                    {convertSize(
                      selected.reduce(
                        (prev, curr) => (curr.size ? curr.size + prev : prev),
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
  );
};

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
  const [preview, setPreview] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState<Array<any>>([]);

  // Close all headers menu when selected files change
  useEffect(() => {
    if (selectedFiles.length === 0) {
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
          <div className="">
            <div className="text-xl">
              <HeaderButton onClick={() => setDeleteMenu(!deleteMenu)}>
                <i className="fas fa-trash-alt" />
              </HeaderButton>

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

              <AddToMenu selected={selectedFiles} />
            </div>
          </div>
        ) : null}

        <div className="">
          <HeaderButton
            onClick={() => setListMode(listMode === "grid" ? "list" : "grid")}
          >
            {listMode === "grid" ? (
              <i className="fas fa-list text-xl" />
            ) : (
              <i className="fas fa-th-large text-xl" />
            )}
          </HeaderButton>

          <HeaderButton
            onClick={() => {
              setInfoVisible((old) => !old);
            }}
          >
            <i className="fas fa-info-circle text-xl" />
          </HeaderButton>
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

        <AsideDetails
          selected={selectedFiles}
          onClose={() => setInfoVisible(false)}
          visible={infoVisible}
        />
      </div>
    </div>
  );
};

export default FileList;
