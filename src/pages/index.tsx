import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Gauge from "../components/Gauge";
import { useReaderContext } from "../context/readerContext";
import { useState } from "react";
dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const [infoType, setInfoType] = useState("details");
  const { AddItemToList } = useReaderContext();
  const { data, isFetching } = useQuery(["dashboard"], async () => {
    const res = await fetch(`/api/dashboard`);
    const body = await res.json();
    return body;
  });

  return (
    <section className="flex flex-col-reverse md:flex-row flex-nowrap flex-grow font-bold p-2 overflow-y-auto">
      <div className="block md:flex-grow md:w-0 mt-6 md:mt-0 px-0 md:px-4 bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark">
        <div className="">
          <h3 className="my-4 text-">Recent Files</h3>

          <ul>
            {data && data.mostRecentFiles
              ? data.mostRecentFiles.map((file) => (
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

      <aside className="shrink-0 w-full md:w-80 ml-0 md:ml-6 pt-4 px-6 bg-custom-bg-light dark:bg-custom-bg-dark text-custom-text-light dark:text-custom-text-dark">
        <div>Your Cloud</div>

        <div>
          <Gauge value={80} />
          <div className="flex flex-row flex-nowrap justify-between">
            <div>
              <div className="">40 GB</div>
              <span className="text-gray-500 font-normal">Used Space</span>
            </div>

            <div>
              <div>120 GB</div>
              <span className="text-gray-500 font-normal">Total Space</span>
            </div>
          </div>
        </div>

        <div>
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

          <div>
            <ul className="mt-4 overflow-y-auto">
              {infoType === "details" ? (
                <>
                  <li className="flex flex-row flex-nowrap items-center mb-4 border py-2 px-4 rounded-lg">
                    <i className="fas fa-file-audio mr-4 text-4xl" />
                    <div className="flex-grow">
                      <div className="font-medium">Audio</div>
                      <span className="text-gray-500 font-normal text-sm">
                        100 Files
                      </span>
                    </div>

                    <div className="text-gray-500">25 GB</div>
                  </li>

                  <li className="flex flex-row flex-nowrap items-center mb-4 border py-2 px-4 rounded-lg">
                    <i className="fas fa-file-image mr-4 text-4xl" />
                    <div className="flex-grow">
                      <div className="font-medium">Photos</div>
                      <span className="text-gray-500 font-normal text-sm">
                        100 Files
                      </span>
                    </div>

                    <div className="text-gray-500">25 GB</div>
                  </li>

                  <li className="flex flex-row flex-nowrap items-center mb-4 border py-2 px-4 rounded-lg">
                    <i className="fas fa-file-video mr-4 text-4xl" />
                    <div className="flex-grow">
                      <div className="font-medium">Videos</div>
                      <span className="text-gray-500 font-normal text-sm">
                        100 Files
                      </span>
                    </div>

                    <div className="text-gray-500">25 GB</div>
                  </li>
                </>
              ) : (
                <>
                  {data.latestActivity
                    ? data.latestActivity.map((item) => (
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
                              {item.actionType === "delete" ? "Deleted " : null}
                              <span>{dayjs(item.createdAt).fromNow()}</span>
                            </div>
                          </div>
                        </li>
                      ))
                    : null}
                  {data.latestActivity.length === 0 ? <li>NO aci</li> : null}
                </>
              )}
            </ul>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default Home;
