"use server";
import { EpisodeService } from "@/services/episode";
import { revalidateTag } from "next/cache";
import { createEpisodeSchema, CreateEpisodeType } from "../schema/episode";

const episodeService = new EpisodeService();

export const createEpisode = async (payload: CreateEpisodeType) => {
  const valid = createEpisodeSchema.parse(payload);

  const episodeCreateInput =
    valid.mediaType === "movies"
      ? await episodeService.getMovieEpisodeCreateInput({
          tmdbId: payload.tmdbId,
          language: payload.language,
          videHost: payload.videoHost,
          url: payload.url,
        })
      : await episodeService.getSerieEpisodeCreateInput({
          tmdbId: valid.tmdbId,
          language: valid.language,
          season: valid.season,
          episode: valid.episode,
          videHost: valid.videoHost,
          url: valid.url,
        });

  const episode = await episodeService.upsert(
    valid.mediaId,
    episodeCreateInput,
  );
  revalidateTag(`media-${valid.mediaType}-${valid.mediaId}`);
  return episode;
};
