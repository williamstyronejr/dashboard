import { NextPage } from "next";
import FileList from "../../components/FileList";

const CollectionPage: NextPage = () => {
  return (
    <section className="flex flex-row flex-nowrap h-0 flex-grow bg-custom-bg-off-light dark:bg-custom-bg-off-dark text-custom-text-light dark:text-custom-text-dark">
      <FileList heading="collection" queryUrl="/api/collection" />
    </section>
  );
};

export default CollectionPage;
