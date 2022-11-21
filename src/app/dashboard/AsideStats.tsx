"use client";
import { FC, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Gauge from "../../components/Gauge";
import { convertSize } from "../../utils/utils";
dayjs.extend(relativeTime);

const AsideStats: FC<{ data: any }> = ({ data }) => {
  const [infoType, setInfoType] = useState("details");

  return (
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
                              {item.actionType === "delete" ? "Deleted " : null}
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
  );
};

export default AsideStats;
