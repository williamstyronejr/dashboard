import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

const TagListPage: NextPage = () => {
  const [page, setPage] = useState(0);

  const { data } = useQuery(
    ["tag", page],
    async () => {
      const res = await fetch(`/api/tags?page=${page}&limit=10`);

      const body = await res.json();
      return body;
    },
    { keepPreviousData: true }
  );

  return (
    <section className="">
      <header className="font-extrabold">Tags</header>

      <div>
        <ul className="grid grid-cols-[repeat(auto-fit,_minmax(8rem,_1fr))] gap-4 divide mb-2 ">
          {data
            ? data.results.map((tag) => (
                <li key={tag.id} className="">
                  <Link href={`/tags/${tag.id}`}>
                    <a className="block h-full w-full text-center py-4">
                      {tag.name}
                    </a>
                  </Link>
                </li>
              ))
            : null}
        </ul>

        <div>
          <button
            type="button"
            onClick={() => {
              if (page !== 0) setPage((old) => old - 1);
            }}
          >
            Prev
          </button>

          <button
            type="button"
            onClick={() => {
              if (data && data.nextPage) setPage((old) => old + 1);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default TagListPage;
