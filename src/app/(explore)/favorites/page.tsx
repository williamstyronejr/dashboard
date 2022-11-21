import FileList from "../../../components/FileList";

const FavoritesPage = () => (
  <FileList heading="Favorites" queryUrl="/api/favorites" />
);

export default FavoritesPage;
