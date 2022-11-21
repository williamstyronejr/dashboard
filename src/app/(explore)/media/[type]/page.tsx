import FileList from "../../../../components/FileList";

const MediaTypePage = ({ params }: { params: { type: string } }) => (
  <FileList heading={params.type} queryUrl={`/api/media/${params.type}`} />
);

export default MediaTypePage;
