"use server";
import { getGenresCached } from "@/features/genres/server/actions/genre";
import {
  editMediaSchema,
  EditMediaType,
  GetMediaDetailsBatchType,
  getMediaDetailsSchema,
} from "@/features/media/schemas/media";
import MediaService from "@/features/media/server/db/media";
import { getNetworksCached } from "@/features/networks/server/actions/network";
import { getWatchProvidersCached } from "@/features/watchProviders/server/actions/watchProvider";
import {
  getMediaGlobalTag,
  getMediaIdTag,
  getMediaTmdbIdTag,
  getMediaTypeTag,
} from "@/lib/cache";
import { ChangePageType, dbCache } from "@/lib/utils";
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

export const getCatalogue = async (payload: ChangePageType) => {
  const networks =
    payload.networks === "any" ? [] : payload.networks.split(",");
  const genres = payload.genres === "any" ? [] : payload.genres.split(",");
  const watchProviders =
    payload.watchProviders === "any" ? [] : payload.watchProviders.split(",");

  const cacheFn = dbCache(mediaService.findPaginated, {
    tags: ["medias", `getPaginated-${payload.page}`],
  });
  const results = await cacheFn(payload.page, {
    genreIds: genres,
    networkIds: networks,
    watchProviderIds: watchProviders,
    orderBy: payload.orderBy,
    mediaType: payload.mediaType,
  });

  const [networkList, genreList, watchProviderList] = await Promise.all([
    getNetworksCached(),
    getGenresCached(),
    getWatchProvidersCached(),
  ]);

  return {
    results,
    networks: networkList,
    genres: genreList,
    watchProviders: watchProviderList,
  };
};

export const searchMedia = async (query?: string) => {
  if (!query) return [];
  return mediaService.search(query);
};

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
