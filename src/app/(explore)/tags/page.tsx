"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Tag } from "@prisma/client";

const TagListPage = () => {
  const [page, setPage] = useState(0);

  const { data } = useQuery(
    ["tag", page],
    async () => {
      const res = await fetch(`/api/tags?page=${page}&limit=10`);

      const body = await res.json();
      return body as { results: Array<Tag> };
    },
    { keepPreviousData: true }
  );

  return (
    <>
      <header className="font-extrabold">Tags</header>

      <div>
        <ul className="grid grid-cols-[repeat(auto-fit,_minmax(8rem,_1fr))] gap-4 divide mb-2 ">
          {data
            ? data.results.map((tag) => (
                <li key={tag.id} className="">
                  <Link
                    href={`/tags/${tag.id}`}
                    className="block h-full w-full text-center py-4"
                  >
                    {tag.name}
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
    </>
  );
};

export default TagListPage;
