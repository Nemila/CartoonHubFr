import {
  CreateMediaType,
  EditMediaType,
  GetMediaDetailsType,
} from "@/features/media/schemas/media";
import prisma from "@/lib/prisma";
import tmdb, { TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import { media, MediaType, Prisma } from "@prisma/client";
import _ from "lodash";
import { Flatrate, Genre, WatchProviders } from "tmdb-ts";

export default class MediaService {
  defaultLimit = 18;

  create = async (payload: CreateMediaType) => {
    const createInput =
      payload.mediaType === "movies"
        ? await this.getMovieCreateInput(payload.tmdbId)
        : await this.getSerieCreateInput(payload);

    return await prisma.media.upsert({
      where: { mediaType_tmdbId_season: payload },
      create: createInput,
      update: createInput,
    });
  };

  update = async (payload: EditMediaType) => {
    const { id, ...updateDate } = payload;

    const results = await prisma.media.update({
      where: { id },
      data: updateDate,
    });

    return results;
  };

  delete = async (id: number) => {
    const results = await prisma.media.delete({ where: { id } });
    return results;
  };

  trending = async (payload?: { mediaType: MediaType }) => {
    const results = await prisma.media.findMany({
      where: { mediaType: payload?.mediaType },
      orderBy: { popularity: "desc" },
      take: this.defaultLimit,
      distinct: ["originalTitle"],
    });

    return results;
  };

  newReleases = async (payload?: { mediaType: MediaType }) => {
    const results = await prisma.media.findMany({
      where: { mediaType: payload?.mediaType },
      orderBy: { popularity: "desc" },
      take: this.defaultLimit,
      distinct: ["createdAt"],
    });

    return results;
  };

  details = async (payload: GetMediaDetailsType) => {
    const result = await prisma.media.findUnique({
      where: { mediaType_tmdbId_season: payload },
      include: {
        genres: true,
        networks: true,
        providers: true,
        episodes: {
          orderBy: { number: "asc" },
          include: {
            players: {
              orderBy: [{ host: { priority: "asc" } }, { updatedAt: "desc" }],
            },
          },
        },
      },
    });
    return result;
  };

  search = async (query: string): Promise<media[]> => {
    const res = await prisma.$queryRawUnsafe(
      `SELECT *, GREATEST(SIMILARITY(title, $1), SIMILARITY("originalTitle", $1)) as score FROM media 
      WHERE SIMILARITY(title, $1) > 0.14 OR SIMILARITY("originalTitle", $1) > 0.14
      ORDER BY score DESC LIMIT 40`,
      query,
    );

    return res as media[];
  };

  getUniqueFlatrates = (watchProviders: WatchProviders) => {
    const uniqueFlatrate: Flatrate[] = [];

    const flatrates = [
      watchProviders.results?.FR?.flatrate,
      watchProviders.results?.BE?.flatrate,
      watchProviders.results?.CH?.flatrate,
      watchProviders.results?.CA?.flatrate,
      watchProviders.results?.US?.flatrate,
    ]
      .flat()
      .filter((item) => Boolean(item));

    for (const flatrate of flatrates) {
      const exists = uniqueFlatrate.find(
        (item) => item.provider_id === flatrate.provider_id,
      );
      if (!exists) uniqueFlatrate.push(flatrate);
    }

    return uniqueFlatrate;
  };

  mapGenres = (genres: Genre[]) => {
    const mapTable: Record<number, { id: number; name: string }> = {
      12: { id: 10759, name: "Action & Aventure" },
      28: { id: 10759, name: "Action & Aventure" },
      14: { id: 10765, name: "Science Fiction & Fantasy" },
      878: { id: 10765, name: "Science Fiction & Fantasy" },
    };

    return genres.map((item) => ({
      name: mapTable[item.id]?.name || item.name,
      id: mapTable[item.id]?.id || item.id,
    }));
  };

  getMovieCreateInput = async (tmdbId: number) => {
    const tmdbDetails = await tmdb.movies.details(tmdbId, undefined, "fr-FR");
    const alternativeTitles = await tmdb.movies.alternativeTitles(tmdbId);
    const externalIds = await tmdb.movies.externalIds(tmdbId);
    const images = await tmdb.movies.images(tmdbId);
    const videos = await tmdb.movies.videos(tmdbId);
    const watchProviders = await tmdb.movies.watchProviders(tmdbId);
    const uniqueFlatrate = this.getUniqueFlatrates(watchProviders);

    const mediaCreateInput = {
      tmdbId,
      season: 1,
      mediaType: "movies",
      originalTitle: tmdbDetails.original_title,
      overview: tmdbDetails.overview,
      releaseDate: tmdbDetails.release_date,
      title: tmdbDetails.title,
      adult: tmdbDetails.adult,
      imdbId: externalIds.imdb_id,
      popularity: tmdbDetails.popularity,
      rating: tmdbDetails.vote_average,
      backdropPath: tmdbDetails.backdrop_path
        ? TMDB_IMAGE_BASE_URL + tmdbDetails.backdrop_path
        : undefined,
      posterPath: tmdbDetails.poster_path
        ? TMDB_IMAGE_BASE_URL + tmdbDetails.poster_path
        : undefined,
      backdropImages: images.backdrops.map(
        (item) => TMDB_IMAGE_BASE_URL + item.file_path,
      ),
      posterImages: images.posters.map(
        (item) => TMDB_IMAGE_BASE_URL + item.file_path,
      ),
      videos: {
        set: videos.results
          .filter((item) => item.site.toLowerCase() === "youtube")
          .map((item) => "https://www.youtube.com/watch?v=" + item.key),
      },
      alternativeTitles:
        alternativeTitles.titles?.map((item) => item.title) || [],
      genres: {
        connectOrCreate: this.mapGenres(tmdbDetails.genres).map((item) => ({
          where: { tmdbId: item.id },
          create: {
            slug: _.kebabCase(item.name),
            tmdbId: item.id,
            name: item.name,
          },
        })),
      },
      status: tmdbDetails.status,
      tagline: tmdbDetails.tagline,
      providers: {
        connectOrCreate: uniqueFlatrate.map((item) => ({
          where: {
            slug: _.kebabCase(item.provider_name),
          },
          create: {
            logoPath: TMDB_IMAGE_BASE_URL + item.logo_path,
            name: item.provider_name,
            slug: _.kebabCase(item.provider_name),
            priority: item.display_priority,
            tmdbId: item.provider_id,
          },
        })),
      },
    } satisfies Prisma.mediaCreateInput;
    return mediaCreateInput;
  };

  getSerieCreateInput = async (payload: { tmdbId: number; season: number }) => {
    const tmdbDetails = await tmdb.tvShows.details(
      payload.tmdbId,
      undefined,
      "fr-FR",
    );

    let tmdbSeason;
    try {
      tmdbSeason = await tmdb.tvSeasons.details(
        { seasonNumber: payload.season, tvShowID: payload.tmdbId },
        undefined,
        { language: "fr-FR" },
      );
    } catch (error) {
      console.error((error as Error).message, "Title:", tmdbDetails.name);
    }

    const alternativeTitles = await tmdb.tvShows.alternativeTitles(
      payload.tmdbId,
    );
    const externalIds = await tmdb.tvShows.externalIds(payload.tmdbId);
    const images = await tmdb.tvShows.images(payload.tmdbId);
    const videos = await tmdb.tvShows.videos(payload.tmdbId);
    const watchProviders = await tmdb.tvShows.watchProviders(payload.tmdbId);
    const uniqueFlatrate = this.getUniqueFlatrates(watchProviders);

    const mediaCreateInput = {
      tmdbId: payload.tmdbId,
      season: payload.season,
      mediaType: "series",
      status: tmdbDetails.status,
      tagline: tmdbDetails.tagline,
      originalTitle: tmdbDetails.original_name,
      overview: tmdbDetails.overview,
      releaseDate: tmdbDetails.first_air_date,
      title: `${tmdbDetails.name} Saison ${payload.season}`,
      imdbId: externalIds.imdb_id,
      popularity: tmdbDetails.popularity,
      rating: tmdbDetails.vote_average,
      posterPath:
        tmdbSeason?.poster_path || tmdbDetails.poster_path
          ? TMDB_IMAGE_BASE_URL +
            (tmdbSeason?.poster_path || tmdbDetails.poster_path)
          : undefined,

      backdropPath: tmdbDetails.backdrop_path
        ? TMDB_IMAGE_BASE_URL + tmdbDetails.backdrop_path
        : undefined,
      backdropImages: images.backdrops.map(
        (item) => TMDB_IMAGE_BASE_URL + item.file_path,
      ),
      posterImages: images.posters.map(
        (item) => TMDB_IMAGE_BASE_URL + item.file_path,
      ),
      networks: {
        connectOrCreate: tmdbDetails.networks.map((item) => ({
          where: {
            slug: _.kebabCase(item.name),
          },
          create: {
            country: item.origin_country,
            logoPath: TMDB_IMAGE_BASE_URL + item.logo_path,
            name: item.name,
            tmdbId: item.id,
            slug: _.kebabCase(item.name),
          },
        })),
      },
      videos: {
        set: videos.results
          .filter((item) => item.site.toLowerCase() === "youtube")
          .map((item) => "https://www.youtube.com/watch?v=" + item.key),
      },
      alternativeTitles:
        alternativeTitles.titles?.map((item) => item.title) || [],
      genres: {
        connectOrCreate: this.mapGenres(tmdbDetails.genres).map((item) => ({
          where: { tmdbId: item.id },
          create: {
            slug: _.kebabCase(item.name),
            tmdbId: item.id,
            name: item.name,
          },
        })),
      },
      providers: {
        connectOrCreate: uniqueFlatrate.map((item) => ({
          where: {
            slug: _.kebabCase(item.provider_name),
          },
          create: {
            logoPath: TMDB_IMAGE_BASE_URL + item.logo_path,
            name: item.provider_name,
            priority: item.display_priority,
            tmdbId: item.provider_id,
            slug: _.kebabCase(item.provider_name),
          },
        })),
      },
    } satisfies Prisma.mediaCreateInput;
    return mediaCreateInput;
  };

  countSeasons = async (payload: { mediaType: MediaType; tmdbId: number }) => {
    const count = await prisma.media.findMany({
      where: {
        mediaType: payload.mediaType,
        tmdbId: payload.tmdbId,
      },
    });

    return count.length;
  };

  count = async (mediaType: MediaType) => {
    const count = await prisma.media.count({ where: { mediaType } });
    return count;
  };
}
