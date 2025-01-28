import prisma from "@/lib/prisma";
import tmdb, { TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import { Media, MediaType, Prisma } from "@prisma/client";
import _ from "lodash";
import { Flatrate, Genre, WatchProviders } from "tmdb-ts";
import {
  CreateMediaType,
  EditMediaType,
  GetMediaDetailsType,
} from "@/features/media/schemas/media";

export default class MediaService {
  findMany = async (payload: Prisma.MediaFindManyArgs) => {
    return await prisma.media.findMany({
      where: payload?.where,
      take: payload?.take || 24,
      skip: payload?.skip,
      orderBy: payload?.orderBy || { popularity: "desc" },
      distinct: payload?.distinct,
    });
  };

  getPopular = async () => await this.findMany({ distinct: ["originalTitle"] });

  getRecentUpdates = async () => {
    return await this.findMany({
      distinct: ["originalTitle"],
      orderBy: { createdAt: "desc" },
    });
  };

  findManyByTmdbIds = async (tmdbIds: number[]) => {
    return await this.findMany({
      distinct: ["originalTitle"],
      where: { tmdbId: { in: tmdbIds } },
    });
  };

  getDetails = async (payload: GetMediaDetailsType) => {
    return await prisma.media.findUnique({
      where: {
        mediaType_tmdbId_season: {
          mediaType: payload.mediaType,
          tmdbId: payload.tmdbId,
          season: payload.season,
        },
      },
      include: {
        genres: true,
        networks: true,
        watchProviders: { orderBy: { priority: "asc" } },
        episodes: {
          orderBy: { number: "asc" },
          include: {
            players: {
              orderBy: [
                { videoHost: { priority: "asc" } },
                { createdAt: "desc" },
              ],
            },
          },
        },
      },
    });
  };

  findPaginated = async (
    page: number,
    filter: {
      genreIds: string[];
      networkIds: string[];
      watchProviderIds: string[];
      orderBy: "popularity" | "rating" | "latest";
      mediaType: "series" | "movies" | "any";
    },
  ) => {
    const defaultLimit = 24;
    return await this.findMany({
      skip: (page - 1) * defaultLimit,
      distinct: ["originalTitle"],
      take: defaultLimit,
      where: {
        ...(filter.mediaType !== "any" && {
          mediaType: filter.mediaType,
        }),
        ...(filter.genreIds.length > 0 && {
          genreIds: {
            hasEvery: filter.genreIds,
          },
        }),
        ...(filter.networkIds.length > 0 && {
          networkIds: {
            hasEvery: filter.networkIds,
          },
        }),
        ...(filter.watchProviderIds.length > 0 && {
          watchProviderIds: {
            hasEvery: filter.watchProviderIds,
          },
        }),
      },
      orderBy:
        filter.orderBy === "popularity"
          ? { popularity: "desc" }
          : filter.orderBy === "rating"
            ? { rating: "desc" }
            : filter.orderBy === "latest"
              ? { createdAt: "desc" }
              : undefined,
    });
  };

  search = async (query: string, limit: number = 24): Promise<Media[]> => {
    const results = await prisma.media.aggregateRaw({
      pipeline: [
        {
          $search: {
            index: "media_search_index",
            text: {
              query: query,
              path: ["title", "originalTitle", "alternativeTitles"],
              fuzzy: { maxEdits: 2, prefixLength: 2 },
            },
          },
        },
        { $limit: limit },
      ],
    });
    const typedResults = results as unknown as (Media & {
      _id: { $oid: string };
    })[];
    return typedResults.map((item) => {
      const { _id, ...rest } = item;
      return { ...rest, id: _id.$oid };
    });
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
      alternativeTitles: alternativeTitles.titles
        ?.map((item) => item.title)
        .join(", "),
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
      watchProviders: {
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
    } satisfies Prisma.MediaCreateInput;
    return mediaCreateInput;
  };

  getSerieCreateInput = async (tmdbId: number, season: number) => {
    const tmdbDetails = await tmdb.tvShows.details(tmdbId, undefined, "fr-FR");
    let tmdbSeason;
    try {
      tmdbSeason = await tmdb.tvSeasons.details(
        { seasonNumber: season, tvShowID: tmdbId },
        undefined,
        { language: "fr-FR" },
      );
    } catch (error) {
      console.error((error as Error).message, "Title:", tmdbDetails.name);
    }

    const alternativeTitles = await tmdb.tvShows.alternativeTitles(tmdbId);
    const externalIds = await tmdb.tvShows.externalIds(tmdbId);
    const images = await tmdb.tvShows.images(tmdbId);
    const videos = await tmdb.tvShows.videos(tmdbId);

    const watchProviders = await tmdb.tvShows.watchProviders(tmdbId);
    const uniqueFlatrate = this.getUniqueFlatrates(watchProviders);

    const mediaCreateInput = {
      tmdbId,
      season,
      mediaType: "series",
      status: tmdbDetails.status,
      tagline: tmdbDetails.tagline,
      originalTitle: tmdbDetails.original_name,
      overview: tmdbDetails.overview,
      releaseDate: tmdbDetails.first_air_date,
      title: `${tmdbDetails.name} Saison ${season}`,
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
      alternativeTitles: alternativeTitles.titles
        ?.map((item) => item.title)
        .join(", "),
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
      watchProviders: {
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
    } satisfies Prisma.MediaCreateInput;
    return mediaCreateInput;
  };

  addMedia = async (payload: CreateMediaType) => {
    const createInput =
      payload.mediaType === "movies"
        ? await this.getMovieCreateInput(payload.tmdbId)
        : await this.getSerieCreateInput(payload.tmdbId, payload.season);
    return await this.upsert(createInput);
  };

  upsert = async (payload: Prisma.MediaCreateInput) => {
    return await prisma.media.upsert({
      where: {
        mediaType_tmdbId_season: {
          mediaType: payload.mediaType,
          tmdbId: payload.tmdbId,
          season: payload.season,
        },
      },
      update: payload,
      create: payload,
    });
  };

  update = async (payload: EditMediaType) => {
    const { id, ...rest } = payload;
    return await prisma.media.update({
      where: { id: id },
      data: rest,
    });
  };

  delete = async (where: Prisma.MediaWhereUniqueInput) => {
    return await prisma.media.delete({ where });
  };

  getSeasons = async (mediaType: MediaType, tmdbId: number) => {
    return await prisma.media.count({
      orderBy: { season: "asc" },
      where: { mediaType, tmdbId },
    });
  };

  findUnique = async (payload: CreateMediaType) => {
    return await prisma.media.findUnique({
      where: { mediaType_tmdbId_season: { ...payload } },
    });
  };

  findById = async (id: string) => {
    return await prisma.media.findUnique({ where: { id } });
  };

  countMedia = async (mediaType: MediaType) => {
    const media = await prisma.media.findMany({
      distinct: ["tmdbId"],
      where: { mediaType },
      select: { id: true },
    });
    return media.length;
  };
}
