"use client";
import { FC, ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Gauge from "../../components/Gauge";
import { useReaderContext } from "../../context/readerContext";
import { convertSize } from "../../utils/utils";
import Link from "next/link";
dayjs.extend(relativeTime);

const CardTile: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col flex-nowrap w-full mx-auto h-80 mb-4 md:mb-0 rounded-2xl overflow-hidden bg-slate-200 hover:scale-105 transition-transform">
    {children}
  </div>
);

const DashboardPage = () => {
  const [infoType, setInfoType] = useState("details");
  const { data, isFetching } = useQuery(["dashboard"], async () => {
    const res = await fetch(`/api/dashboard`);
    if (res.ok) return await res.json();
    throw new Error("An error occurred during request, please try again.");
  });

  return (
    <section className="min-h-full p-2 overflow-y-auto bg-gradient-to-r from-cyan-500 to-blue-500">
      <header className="">
        <h2 className="text-center font-bold">Welcome Back, username</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 max-w-3xl mx-auto">
        <CardTile>
          <h3 className="font-bold">
            <Link
              href="/media"
              className="block hover:bg-slate-400 py-3 px-2 transition-colors"
            >
              Files
            </Link>
          </h3>

          <ul className="bg-white flex-grow px-4 overflow-y-auto divide-y">
            {data
              ? data.mostRecentFiles.map((item) => (
                  <>
                    <li
                      key={`item-${item.id}`}
                      className="flex flex-row flex-nowrap py-3"
                    >
                      <div className="text-4xl mr-4">
                        {item.type === "audio" ? (
                          <i className="fas fa-file-audio" />
                        ) : null}
                      </div>

                      <h4
                        title={item.title || item.fileName}
                        className="flex-grow mx-2 whitespace-nowrap text-ellipsis overflow-hidden"
                      >
                        {item.title || item.fileName}
                      </h4>

                      <div className="hidden md:block whitespace-nowrap">
                        {dayjs(item.createAt).format("ddd, DD MMM YYYY")}
                      </div>
                    </li>
                  </>
                ))
              : null}
          </ul>
        </CardTile>

        <CardTile>
          <h3 className="font-bold px-2 py-3">Storage</h3>

          <div className="flex-grow h-0 bg-white">
            <Gauge
              className="mt-4"
              value={data ? data.usedSpace / data.totalSpace : 0}
            />

            <div className="flex flex-row flex-nowrap justify-between px-4 py-4">
              <div>
                <div className="">{convertSize(data ? data.usedSpace : 0)}</div>
                <span className="text-gray-500 font-normal">Used Space</span>
              </div>

              <div>
                <div>{convertSize(data ? data.totalSpace : 0)}</div>
                <span className="text-gray-500 font-normal">Total Space</span>
              </div>
            </div>
          </div>
        </CardTile>

        <CardTile>
          <h3 className="font-bold bg-slate-200 py-3 px-2">Recent Activity </h3>

          <ul className="flex flex-col flex-nowrap flex-grow px-2 overflow-y-auto bg-white">
            {data
              ? data.latestActivity.map((item: any) => (
                  <li
                    key={`activity-${item.id}`}
                    className="py-2 px-4 rounded-lg"
                  >
                    <div>
                      <span
                        title={item.actionItem}
                        className="block font-normal whitespace-nowrap text-ellipsis overflow-hidden"
                      >
                        {item.actionItem}
                      </span>

                      <div className="text-gray-500 font-normal text-sm">
                        {item.actionType === "delete" ? "Deleted " : null}
                        <span>{dayjs(item.createdAt).fromNow()}</span>
                      </div>
                    </div>

                    <hr className="mt-2" />
                  </li>
                ))
              : null}
            {data && data.latestActivity.length === 0 ? (
              <li>No Activities</li>
            ) : null}
          </ul>
        </CardTile>

        <CardTile>
          <h3 className="font-bold px-2 py-3 flex-grow">
            <Link href="/settings" className="block h-full">
              <div className="ml-6">
                <i className="block fas fa-cog text-8xl" />
                <div className="block ml-4  font-semibold text-2xl">
                  Settings
                </div>
              </div>
            </Link>
          </h3>{" "}
        </CardTile>
      </div>
    </section>
  );
};

const OldDashboardPage = () => {
  const [infoType, setInfoType] = useState("details");
  const { AddItemToList } = useReaderContext();
  const { data, isFetching } = useQuery(["dashboard"], async () => {
    const res = await fetch(`/api/dashboard`);
    const body = await res.json();
    // return body;
    throw new Error();
    return {};
  });

  return (
    <section className="flex flex-col-reverse md:flex-row flex-nowrap h-full font-bold p-2 overflow-y-auto">
      <div className="block md:flex-grow md:w-0 mt-6 md:mt-0 px-0 md:px-4 bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark">
        <div className="">
          <h3 className="my-4 text-">Recent Files</h3>

          <ul>
            {data && data.mostRecentFiles
              ? data.mostRecentFiles.map((file: any) => (
                  <li key={`recent-${file.id}`} className="">
                    <button
                      className="flex flex-row flex-nowrap items-center w-full text-left"
                      type="button"
                      onClick={() => AddItemToList(file.id, file.title, file)}
                    >
                      <div className="text-4xl mr-4">
                        {file.type === "audio" ? (
                          <i className="fas fa-file-audio" />
                        ) : null}
                      </div>

                      <h4
                        title={file.title || file.fileName}
                        className="flex-grow mx-2 whitespace-nowrap text-ellipsis overflow-hidden"
                      >
                        {file.title || file.fileName}
                      </h4>

                      <div className="hidden md:block whitespace-nowrap">
                        {dayjs(file.createAt).format("ddd, DD MMM YYYY")}
                      </div>
                    </button>

                    <hr className="my-3" />
                  </li>
                ))
              : null}
          </ul>
        </div>
      </div>

      <aside className="flex flex-col flex-nowrap shrink-0 w-full md:w-80 ml-0 md:ml-6 pt-4 px-6 bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark">
        <div>Your Cloud</div>

        <div>
          <Gauge value={data ? data.usedSpace / data.totalSpace : 0} />
          <div className="flex flex-row flex-nowrap justify-between">
            <div>
              <div className="">{convertSize(data ? data.usedSpace : 0)}</div>
              <span className="text-gray-500 font-normal">Used Space</span>
            </div>

            <div>
              <div>{convertSize(data ? data.totalSpace : 0)}</div>
              <span className="text-gray-500 font-normal">Total Space</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-nowrap h-0 flex-grow">
          <div className="">
            <button
              className={`inline-block w-6/12 border-b-2 py-3 ${
                infoType === "details"
                  ? "text-blue-500 border-blue-500"
                  : "text-slate-500"
              }`}
              type="button"
              onClick={() => setInfoType("details")}
            >
              Details
            </button>

            <button
              className={`inline-block w-6/12 border-b-2 py-3 ${
                infoType === "activity"
                  ? "text-blue-500 border-blue-500"
                  : "text-slate-500"
              }`}
              type="button"
              onClick={() => setInfoType("activity")}
            >
              Activity
            </button>
          </div>

          <div className="px-2 overflow-y-auto">
            {data ? (
              <ul className="mt-4">
                {infoType === "details" ? (
                  <>
                    <li className="flex flex-row flex-nowrap items-center mb-4 border py-2 px-4 rounded-lg">
                      <i className="fas fa-file-audio mr-4 text-4xl" />
                      <div className="flex-grow">
                        <div className="font-medium">Audio</div>
                        <span className="text-gray-500 font-normal text-sm">
                          {data.groupStats.audio.count} Files
                        </span>
                      </div>

                      <div className="text-gray-500">
                        {convertSize(data.groupStats.audio.size)}
                      </div>
                    </li>

                    <li className="flex flex-row flex-nowrap items-center mb-4 border py-2 px-4 rounded-lg">
                      <i className="fas fa-file-image mr-4 text-4xl" />
                      <div className="flex-grow">
                        <div className="font-medium">Photos</div>
                        <span className="text-gray-500 font-normal text-sm">
                          {data.groupStats.image.count} Files
                        </span>
                      </div>

                      <div className="text-gray-500">
                        {convertSize(data.groupStats.image.size)}
                      </div>
                    </li>

                    <li className="flex flex-row flex-nowrap items-center mb-4 border py-2 px-4 rounded-lg">
                      <i className="fas fa-file-video mr-4 text-4xl" />
                      <div className="flex-grow">
                        <div className="font-medium">Videos</div>
                        <span className="text-gray-500 font-normal text-sm">
                          {data.groupStats.video.count} Files
                        </span>
                      </div>

                      <div className="text-gray-500">
                        {convertSize(data.groupStats.video.size)}
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    {data.latestActivity
                      ? data.latestActivity.map((item: any) => (
                          <li
                            key={`activity-${item.id}`}
                            className="mb-4 border py-2 px-4 rounded-lg"
                          >
                            <div>
                              <span
                                title={item.actionItem}
                                className="block font-normal whitespace-nowrap text-ellipsis overflow-hidden"
                              >
                                {item.actionItem}
                              </span>

                              <div className="text-gray-500 font-normal text-sm">
                                {item.actionType === "delete"
                                  ? "Deleted "
                                  : null}
                                <span>{dayjs(item.createdAt).fromNow()}</span>
                              </div>
                            </div>
                          </li>
                        ))
                      : null}
                    {data.latestActivity.length === 0 ? (
                      <li>No Activities</li>
                    ) : null}
                  </>
                )}
              </ul>
            ) : null}
          </div>
        </div>
      </aside>
    </section>
  );
};

export default DashboardPage;
