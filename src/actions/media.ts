"use server";
import {
  editMediaSchema,
  EditMediaType,
  getMediaDetailsSchema,
} from "@/features/media/schemas/media";
import MediaService from "@/services/media";
import { revalidateTag } from "next/cache";

const mediaService = new MediaService();

export const getHomeMedia = async () => {
  const [trending, newReleases] = await Promise.all([
    mediaService.trending(),
    mediaService.newReleases(),
  ]);

  return [trending, newReleases];
};

export const searchMedia = async (query?: string) => {
  if (!query) return [];

  return mediaService.search(query);
};

export const getMediaDetails = async (payload: GetMediaDetailsType) => {
  const valid = getMediaDetailsSchema.parse(payload);

  const media = await mediaService.details(valid);
  if (!media) throw new Error("Media not found");

  const seasonCount = await mediaService.countSeasons(payload);

  return { payload: valid, media, seasonCount };
};

export const getMediaCount = async (mediaType: "series" | "movies") => {
  return await mediaService.count(mediaType);
};

export const editMedia = async (payload: EditMediaType) => {
  const valid = editMediaSchema.parse(payload);

  const media = await mediaService.update(valid);

  revalidateTag(`/`);
  revalidateTag(`/search`);
  revalidateTag(`/[mediaType]/${payload.tmdbId}`);

  return media;
};
