import { NextPage } from "next";
import FileList from "../components/FileList";

const MediaPage: NextPage = () => {
  return (
    <section className="flex flex-row flex-nowrap h-0 flex-grow bg-custom-bg-off-light dark:bg-custom-bg-off-dark text-custom-text-light dark:text-custom-text-dark">
      <FileList heading="favorites" queryUrl="/api/favorites" />
    </section>
  );
};

export default MediaPage;
