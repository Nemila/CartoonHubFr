"use server";
import {
  editMediaSchema,
  EditMediaType,
  GetMediaDetailsBatchType,
  getMediaDetailsSchema,
} from "@/features/media/schemas/media";
import MediaService from "@/features/media/server/db/media";
import {
  getMediaGlobalTag,
  getMediaIdTag,
  getMediaTmdbIdTag,
  getMediaTypeTag,
} from "@/lib/cache";
import { dbCache } from "@/lib/utils";
import { MediaType } from "@prisma/client";
import { revalidateTag } from "next/cache";

const mediaService = new MediaService();

export const getPopularCached = async () => {
  return dbCache(mediaService.getPopular, { tags: [getMediaGlobalTag()] })();
};

export const getRecentUpdatesCached = async () => {
  return dbCache(mediaService.getRecentUpdates, {
    tags: [getMediaGlobalTag()],
  })();
};

export const getPaginatedMediaCached = async (payload: {
  page: number;
  genreIds: string;
  networkIds: string;
  watchProviderIds: string;
  mediaType: "series" | "movies" | "any";
  orderBy: "popularity" | "latest" | "rating";
}) => {
  const networks =
    payload.networkIds === "any" ? [] : payload.networkIds.split(",");
  const genres = payload.genreIds === "any" ? [] : payload.genreIds.split(",");
  const watchProviders =
    payload.watchProviderIds === "any"
      ? []
      : payload.watchProviderIds.split(",");

  const cacheFn = dbCache(mediaService.findPaginated, {
    tags: ["medias", `getPaginated-${payload.page}`],
  });

  return cacheFn(payload.page, {
    genreIds: genres,
    networkIds: networks,
    watchProviderIds: watchProviders,
    orderBy: payload.orderBy,
    mediaType: payload.mediaType,
  });
};

export const searchMedia = async (query?: string) => {
  if (!query) return [];
  return mediaService.search(query);
};

// export const searchMediaCached = async (query?: string) => {
//   if (!query) return [];
//   const cacheFn = dbCache(mediaService.search, { tags: [getMediaGlobalTag()] });
//   return cacheFn(query);
// };

export const getMediaDetailsCached = async (payload: GetMediaDetailsType) => {
  const valid = getMediaDetailsSchema.parse(payload);
  const mediaFn = dbCache(mediaService.getDetails, {
    tags: [
      getMediaGlobalTag(),
      getMediaTypeTag(payload.mediaType),
      getMediaTmdbIdTag(payload.mediaType, payload.tmdbId),
    ],
  });
  const media = await mediaFn(valid);
  if (!media) throw new Error("Media not found");
  const episodeFound = media.episodes.find((i) => i.number === valid.episode);
  const episode = episodeFound || media.episodes[0];
  return { episode, payload: valid, media };
};

export const getMediaDetailsBatch = async (
  payload: GetMediaDetailsBatchType,
) => {
  const mediaDetails = await getMediaDetailsCached({
    episode: payload.episode,
    mediaType: payload.mediaType,
    season: payload.season,
    tmdbId: payload.tmdbId,
  });
  const seasonCount = await mediaService.getSeasons(
    payload.mediaType,
    payload.tmdbId,
  );
  return { ...mediaDetails, seasonCount };
};

export const getMediaCount = async (mediaType: MediaType) => {
  return await mediaService.countMedia(mediaType);
};

export const findMediaByIdCached = async (id: string) => {
  const cacheFn = dbCache(mediaService.findById, {
    tags: [getMediaGlobalTag(), getMediaIdTag(id)],
  });
  return cacheFn(id);
};

export const editMedia = async (payload: EditMediaType) => {
  try {
    const valid = editMediaSchema.parse(payload);
    const media = await mediaService.update(valid);
    revalidateTag(getMediaGlobalTag());
    revalidateTag(getMediaIdTag(media.id));
    revalidateTag(getMediaTypeTag(media.mediaType));
    revalidateTag(getMediaTmdbIdTag(media.mediaType, media.tmdbId));
    return media;
  } catch (error) {
    console.error(error);
  }
};
