import { NextPage } from "next";
import { useRouter } from "next/router";
import FileList from "../components/FileList";

const SearchPage: NextPage = () => {
  const { query } = useRouter();

  if (!query.q) return <div>Loading</div>;
  return (
    <section className="flex flex-row flex-nowrap h-0 flex-grow bg-custom-bg-off-light dark:bg-custom-bg-off-dark text-custom-text-light dark:text-custom-text-dark">
      <FileList
        heading="Search"
        queryUrl="/api/search"
        queryParams={`q=${query.q}`}
      />
    </section>
  );
};

export default SearchPage;
