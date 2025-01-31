import prisma from "@/lib/prisma";
import tmdb, { TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import { Prisma } from "@prisma/client";

type GetMovieEpisodeCreateInputPayload = {
  tmdbId: number;
  url?: string;
  videHost?: string;
  language?: string;
};

type GetSerieEpisodeCreateInputPayload = GetMovieEpisodeCreateInputPayload & {
  season: number;
  episode: number;
};

export class EpisodeService {
  getSerieEpisodeCreateInput = async (
    payload: GetSerieEpisodeCreateInputPayload,
  ) => {
    const episodeDetails = await tmdb.tvEpisode.details(
      {
        tvShowID: payload.tmdbId,
        seasonNumber: payload.season,
        episodeNumber: payload.episode,
      },
      undefined,
      { language: "fr-FR" },
    );

    const episodeCreateInput = {
      media: {
        connect: {
          mediaType_tmdbId_season: {
            mediaType: "series",
            tmdbId: payload.tmdbId,
            season: payload.season,
          },
        },
      },
      number: payload.episode,
      season: payload.season,
      title: episodeDetails?.name || `Episode ${payload.episode}`,
      description: episodeDetails?.overview,
      rating: episodeDetails?.vote_average || 0,
      stillPath: episodeDetails?.still_path
        ? TMDB_IMAGE_BASE_URL + episodeDetails?.still_path
        : undefined,
      runtime: episodeDetails?.runtime || 0,
      releaseDate: episodeDetails?.air_date,
      ...(payload.url && {
        players: {
          connectOrCreate: {
            where: {
              url: payload.url,
            },
            create: {
              url: payload.url,
              languageName: payload.language || "vf",
              videoHostName: payload.videHost || "hydrax",
            },
          },
        },
      }),
    } satisfies Prisma.EpisodeCreateInput;
    return episodeCreateInput;
  };

  getMovieEpisodeCreateInput = async (
    payload: GetMovieEpisodeCreateInputPayload,
  ) => {
    const episodeDetails = await tmdb.movies.details(
      payload.tmdbId,
      undefined,
      "fr-FR",
    );

    const episodeCreateInput = {
      media: {
        connect: {
          mediaType_tmdbId_season: {
            mediaType: "movies",
            tmdbId: payload.tmdbId,
            season: 1,
          },
        },
      },
      number: 1,
      season: 1,
      title: episodeDetails.title,
      description: episodeDetails.overview,
      rating: episodeDetails.vote_average,
      stillPath: episodeDetails.backdrop_path
        ? TMDB_IMAGE_BASE_URL + episodeDetails.backdrop_path
        : undefined,
      runtime: episodeDetails.runtime || 0,
      releaseDate: episodeDetails.release_date,
      ...(payload.url && {
        players: {
          connectOrCreate: {
            where: {
              url: payload.url,
            },
            create: {
              url: payload.url,
              languageName: payload.language || "vf",
              videoHostName: payload.videHost || "hydrax",
            },
          },
        },
      }),
    } satisfies Prisma.EpisodeCreateInput;
    return episodeCreateInput;
  };

  upsert = async (mediaId: number, payload: Prisma.EpisodeCreateInput) => {
    return await prisma.episode.upsert({
      where: {
        mediaId_season_number: {
          mediaId,
          season: payload.season,
          number: payload.number,
        },
      },
      update: payload,
      create: payload,
    });
  };
}
