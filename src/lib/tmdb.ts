import { TMDB } from "tmdb-ts";
const tmdb = new TMDB(process.env.TMDB_API_TOKEN!);
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
export default tmdb;
