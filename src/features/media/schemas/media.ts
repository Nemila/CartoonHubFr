import { z } from "zod";

export const getMediaDetailsSchema = z.object({
  mediaType: z.enum(["series", "movies"]),
  tmdbId: z.coerce.number().min(1),
  season: z.coerce.number(),
  episode: z.coerce.number(),
});
export type GetMediaDetailsType = z.infer<typeof getMediaDetailsSchema>;

export const createMediaSchema = z.object({
  mediaType: z.enum(["series", "movies"]),
  tmdbId: z.coerce.number().min(1),
  season: z.coerce.number(),
});
export type CreateMediaType = z.infer<typeof createMediaSchema>;

export const importMediaSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});
export type ImportMediaType = z.infer<typeof importMediaSchema>;

export const editMediaSchema = z.object({
  id: z.number(),
  tmdbId: z.number(),
  imdbId: z.string(),
  season: z.coerce.number(),
  title: z.string(),
  originalTitle: z.string(),
  alternativeTitles: z.string().array(),
  overview: z.string().optional(),
  releaseDate: z.string().optional(),
  posterPath: z.string().optional(),
  backdropPath: z.string().optional(),
  popularity: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
});
export type EditMediaType = z.infer<typeof editMediaSchema>;

export const orderBySchema = z.enum([
  "popularity_desc",
  "populariy_asc",
  "rating_asc",
  "rating_desc",
  "createdAt_desc",
  "createdAt_asc",
]);
export type OrderByType = z.infer<typeof orderBySchema>;

export const filterMediaSchema = z.object({
  genres: z.number().array().optional(),
  watchProviders: z.number().array().optional(),
  networks: z.number().array().optional(),
  orderBy: orderBySchema.optional(),
});
export type FilterMediaType = z.infer<typeof filterMediaSchema>;

export const getMediaDetailsBatchSchema = z.object({
  episode: z.coerce.number(),
  mediaType: z.enum(["movies", "series"]),
  season: z.coerce.number(),
  tmdbId: z.coerce.number(),
});
export type GetMediaDetailsBatchType = z.infer<
  typeof getMediaDetailsBatchSchema
>;
