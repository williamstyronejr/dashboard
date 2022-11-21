"use client";
import FileList from "../../../../components/FileList";
import { useCollectionById } from "../../../../hooks/api/fetch";

const CollectionPage = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useCollectionById(params.id);
  if (isLoading) return <div>Loading</div>;
  if (!data) return <div>404</div>;

  return (
    <FileList
      heading={data.title}
      queryUrl={`/api/collection/${params.id}/media`}
    />
  );
};

export default CollectionPage;
