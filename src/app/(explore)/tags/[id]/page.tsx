import FileList from "../../../../components/FileList";

const TagPage = ({ params }: { params: { id: string } }) => (
  <FileList heading="Search" queryUrl={`/api/tags/${params.id}`} />
);

export default TagPage;
