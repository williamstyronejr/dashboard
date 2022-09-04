import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Link from "next/link";
import dayjs from "dayjs";

const Home: NextPage = () => {
  const { data, isFetching } = useQuery(["dashboard"], async () => {
    const res = await fetch(`/api/dashboard`);
    const body = await res.json();
    return body;
  });

  return (
    <section className="font-bold p-2">
      <header className="">
        <h2>My Files</h2>

        <Link href="/add">Add File(s)</Link>
      </header>

      <div className="bg-white p-4">
        <h3 className="">Recent Files</h3>

        <ul>
          {data && data.mostRecentFiles
            ? data.mostRecentFiles.map((file) => (
                <li
                  key={`recent-${file.id}`}
                  className="flex flex-row flex-nowrap"
                >
                  <div>
                    {file.type === "audio" ? (
                      <i className="fas fa-file-audio" />
                    ) : null}
                  </div>

                  <h4 className="">{file.caption}</h4>

                  <div>{dayjs(file.createAt).format("ddd, DD MMM YYYY")}</div>
                </li>
              ))
            : null}
        </ul>
      </div>
    </section>
  );
};

export default Home;
