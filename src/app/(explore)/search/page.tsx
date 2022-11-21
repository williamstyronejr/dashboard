import FileList from "../../../components/FileList";

const SearchPage = ({ params }: { params: { q: string } }) => (
  <FileList
    heading="Search"
    queryUrl="/api/search"
    queryParams={`q=${params.q}`}
  />
);

export default SearchPage;
