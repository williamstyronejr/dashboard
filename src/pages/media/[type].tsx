import { NextPage } from "next";
import { useRouter } from "next/router";
import FileList from "../../components/FileList";

const MediaPage: NextPage = () => {
  const { query } = useRouter();

  if (!query.type) return <div>Loading</div>;

  return (
    <section className="flex flex-row flex-nowrap h-0 flex-grow relative bg-custom-bg-off-light dark:bg-custom-bg-off-dark text-custom-text-light dark:text-custom-text-dark">
      <FileList
        heading={query.type.toString()}
        queryUrl={`/api/media/${query.type}`}
      />
    </section>
  );
};

export default MediaPage;
