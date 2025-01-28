import { TMDB } from "tmdb-ts";
const tmdb = new TMDB(
  process.env.TMDB_API_TOKEN ||
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5Yjc2MTEzMGRkNDI4YWNhMTgxNmRhZWIwYjMwNjUxOSIsIm5iZiI6MTcyODA2NzA5Ni44NjkwNTIsInN1YiI6IjYyM2E1ZmY2ZTk0MmJlMDA1YzgzZjcwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HAs0g_2ycZQui__-49XUy3G5ASsqGqmeH4BLm3C--H8",
);
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
export default tmdb;
