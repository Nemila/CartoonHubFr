import db from "@/db";
import { media } from "@/db/schema";
import {
  CreateMediaType,
  EditMediaType,
  FilterMediaType,
  GetMediaDetailsType,
} from "@/features/media/schemas/media";
import prisma from "@/lib/prisma";
import tmdb, { TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";

import { Media, MediaType, Prisma } from "@prisma/client";
import { and, desc, eq, SQL } from "drizzle-orm";
import _ from "lodash";
import { Flatrate, Genre, WatchProviders } from "tmdb-ts";
import { z } from "zod";

export default class MediaService {
  defaultLimit = 40;

  create = async (payload: CreateMediaType) => {
    const createInput =
      payload.mediaType === "movies"
        ? await this.getMovieCreateInput(payload.tmdbId)
        : await this.getSerieCreateInput(payload);

    const results = await db
      .insert(media)
      .values(createInput)
      .onConflictDoUpdate({
        target: [media.tmdbId, media.mediaType, media.season],
        set: createInput,
      })
      .returning();

    return results[0];
  };

  update = async (payload: EditMediaType) => {
    const { id, ...updateDate } = payload;
    const results = await db
      .update(media)
      .set({ ...updateDate })
      .where(and(eq(media.id, id)));
    return results[0];
  };

  delete = async (id: number) => {
    const results = await db.delete(media).where(eq(media.id, id));
    return results[0];
  };

  trending = async (payload?: { mediaType: MediaType }) => {
    const filter = payload?.mediaType
      ? eq(media.mediaType, payload?.mediaType)
      : undefined;

    const results = await db
      .select()
      .from(media)
      .where(filter)
      .orderBy(desc(media.popularity))
      .limit(this.defaultLimit);

    return results;
  };

  newReleases = async (payload?: { mediaType: MediaType }) => {
    const filter = payload?.mediaType
      ? eq(media.mediaType, payload?.mediaType)
      : undefined;

    const results = await db
      .select()
      .from(media)
      .where(filter)
      .orderBy(desc(media.createdAt))
      .limit(this.defaultLimit);

    return results;
  };

  filter = async (payload: FilterMediaType) => {
    const filters: Prisma.MediaWhereInput[] = [];

    if (payload.genres && payload.genres.length > 0) {
      filters.push(
        ...payload.genres.map((genre) => ({
          genres: { some: { id: genre } },
        })),
      );
    }
    if (payload.networks && payload.networks.length > 0) {
      filters.push(
        ...payload.networks.map((network) => ({
          networks: { some: { id: network } },
        })),
      );
    }
    if (payload.watchProviders && payload.watchProviders.length > 0) {
      filters.push(
        ...payload.watchProviders.map((watchProvider) => ({
          watchProviders: { some: { id: watchProvider } },
        })),
      );
    }

    const orderKeySchema = z.enum(["popularity", "rating", "createdAt"]);
    const orderValueSchema = z.enum(["asc", "desc"]);
    const orderParts = payload.orderBy?.split("_") || [];
    const orderKey = orderKeySchema.parse(orderParts[0] || "popularity");
    const orderValue = orderValueSchema.parse(orderParts[1] || "desc");

    const response = await prisma.media.findMany({
      where: { AND: filters },
      orderBy: { [orderKey]: orderValue },
      take: this.defaultLimit,
    });

    return response;
  };

  details = async (payload: GetMediaDetailsType) => {
    return await prisma.media.findUnique({
      where: {
        mediaType_tmdbId_season: {
          mediaType: payload.mediaType,
          season: payload.season,
          tmdbId: payload.tmdbId,
        },
      },
      include: {
        genres: true,
        networks: true,
        watchProviders: {
          orderBy: { priority: "asc" },
        },
        episodes: {
          orderBy: { number: "asc" },
          include: {
            players: {
              orderBy: {
                videoHost: { priority: "asc" },
                createdAt: "desc",
              },
            },
          },
        },
      },
    });
  };

  search = async (query: string): Promise<Media[]> => {
    const results = await prisma.media.findMany({
      where: { title: { search: query } },
      take: this.defaultLimit,
    });
    return results;
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

  getMovieCreateInput = async (
    tmdbId: number,
  ): Promise<typeof media.$inferInsert> => {
    const tmdbDetails = await tmdb.movies.details(tmdbId, undefined, "fr-FR");
    const alternativeTitles = await tmdb.movies.alternativeTitles(tmdbId);
    const images = await tmdb.movies.images(tmdbId);
    const videos = await tmdb.movies.videos(tmdbId);

    const mediaCreateInput = {
      mediaType: "movies",
      originalTitle: tmdbDetails.original_title,
      overview: tmdbDetails.overview,
      releaseDate: tmdbDetails.release_date,
      season: 1,
      title: tmdbDetails.title,
      tmdbId: tmdbDetails.id,
      adult: tmdbDetails.adult,
      alternativeTitles: alternativeTitles.titles.map((item) => item.title),
      backdropImages: images.backdrops.map(
        (item) => TMDB_IMAGE_BASE_URL + item.file_path,
      ),
      backdropPath:
        tmdbDetails.backdrop_path &&
        TMDB_IMAGE_BASE_URL + tmdbDetails.backdrop_path,
      imdbId: tmdbDetails.imdb_id,
      popularity: tmdbDetails.popularity,
      posterImages: images.posters.map(
        (item) => TMDB_IMAGE_BASE_URL + item.file_path,
      ),
      posterPath: tmdbDetails.poster_path
        ? TMDB_IMAGE_BASE_URL + tmdbDetails.poster_path
        : undefined,
      rating: tmdbDetails.vote_average,
      status: tmdbDetails.status,
      tagline: tmdbDetails.tagline,
      videos: videos.results
        .filter((item) => item.site.toLowerCase() === "youtube")
        .map((item) => "https://www.youtube.com/watch?v=" + item.key),
    } satisfies typeof media.$inferInsert;

    return mediaCreateInput;
  };

  getSerieCreateInput = async (payload: {
    tmdbId: number;
    season: number;
  }): Promise<typeof media.$inferInsert> => {
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
    const images = await tmdb.tvShows.images(payload.tmdbId);
    const videos = await tmdb.tvShows.videos(payload.tmdbId);

    const mediaCreateInput = {
      mediaType: "series",
      originalTitle: tmdbDetails.original_name,
      overview: tmdbDetails.overview,
      releaseDate: tmdbSeason?.air_date || tmdbDetails.first_air_date,
      season: payload.season,
      title: `${tmdbDetails.name} Saison ${payload.season}`,
      tmdbId: tmdbDetails.id,
      alternativeTitles: alternativeTitles.titles.map((item) => item.title),
      backdropImages: images.backdrops.map(
        (item) => TMDB_IMAGE_BASE_URL + item.file_path,
      ),
      backdropPath:
        tmdbDetails.backdrop_path &&
        TMDB_IMAGE_BASE_URL + tmdbDetails.backdrop_path,
      popularity: tmdbDetails.popularity,
      posterImages: images.posters.map(
        (item) => TMDB_IMAGE_BASE_URL + item.file_path,
      ),
      posterPath:
        (tmdbSeason?.poster_path || tmdbDetails.poster_path) &&
        TMDB_IMAGE_BASE_URL +
          (tmdbSeason?.poster_path || tmdbDetails.poster_path),
      rating: tmdbDetails.vote_average,
      status: tmdbDetails.status,
      tagline: tmdbDetails.tagline,
      videos: videos.results
        .filter((item) => item.site.toLowerCase() === "youtube")
        .map((item) => "https://www.youtube.com/watch?v=" + item.key),
    } satisfies typeof media.$inferInsert;

    return mediaCreateInput;
  };

  seasons = async (mediaType: MediaType, tmdbId: number) => {
    return await prisma.media.count({ where: { mediaType, tmdbId } });
  };

  findUnique = async (payload: CreateMediaType) => {
    return await prisma.media.findUnique({
      where: { mediaType_tmdbId_season: payload },
    });
  };

  findById = async (id: number) => {
    return await prisma.media.findUnique({ where: { id } });
  };

  countMedia = async (mediaType: MediaType) => {
    return await prisma.media.count({ where: { mediaType } });
  };
}
