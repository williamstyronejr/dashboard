import FileList from "../../../components/FileList";

const StoragePage = () => (
  <FileList heading="Files" queryUrl="/api/media/all" />
);

export default StoragePage;
