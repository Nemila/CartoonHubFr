import GenreService from "@/services/genre";
import { dbCache } from "@/lib/utils";

const genreService = new GenreService();
export const getGenresCached = async () => {
  // TODO: IMPROVE CACHE KEY
  const cacheFn = dbCache(genreService.getAll, { tags: ["genres"] });
  return cacheFn();
};
