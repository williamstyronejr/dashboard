import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import FileList from "../../components/FileList";

const CollectionPage: NextPage = () => {
  const { query } = useRouter();
  const { data, isLoading } = useQuery(
    ["collection"],
    async () => {
      const res = await fetch(`/api/collection/${query.id}`);
      const body = await res.json();
      return body.collection;
    },
    { enabled: !!query.id }
  );

  if (!query.id || isLoading) return <div>Loading</div>;
  if (!data) return <div>404</div>;

  return (
    <section className="flex flex-row flex-nowrap h-0 flex-grow relative bg-custom-bg-off-light dark:bg-custom-bg-off-dark text-custom-text-light dark:text-custom-text-dark">
      <FileList
        heading={data.title}
        queryUrl={`/api/collection/${query.id}/media`}
      />
    </section>
  );
};

export default CollectionPage;
