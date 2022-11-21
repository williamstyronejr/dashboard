import FileList from "../../../components/FileList";

const CollectionsPage = () => (
  <FileList heading="Collections" queryUrl="/api/collection" />
);

export default CollectionsPage;
