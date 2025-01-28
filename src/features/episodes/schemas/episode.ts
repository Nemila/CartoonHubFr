import { z } from "zod";

export const createEpisodeSchema = z.object({
  mediaId: z.string(),
  mediaType: z.enum(["series", "movies"]),
  tmdbId: z.number(),
  season: z.number(),
  episode: z.number(),
  language: z.string().optional(),
  videoHost: z.string().optional(),
  url: z.string().optional(),
});
export type CreateEpisodeType = z.infer<typeof createEpisodeSchema>;
