"use server";
import prisma from "@/lib/prisma";
import { dbCache } from "@/lib/utils";
import {
  editMediaSchema,
  EditMediaType,
  getMediaDetailsSchema,
  GetMediaDetailsType,
} from "@/schema/media";
import MediaService from "@/services/media";
import { revalidateTag } from "next/cache";

const mediaService = new MediaService();

export const getHomeMediaInner = async () => {
  const [trending, newRelease, popularSeriesLastYear, popularMoviesLastYear] =
    await Promise.all([
      mediaService.trending(),
      mediaService.newReleases(),
      mediaService.trendingByYear({
        mediaType: "series",
        year: new Date().getFullYear() - 1,
      }),
      mediaService.trendingByYear({
        mediaType: "movies",
        year: new Date().getFullYear() - 1,
      }),
    ]);

  return {
    trending,
    newRelease,
    popularSeriesLastYear,
    popularMoviesLastYear,
  };
};

export const getHomeMedia = async (userId?: string) => {
  const histories = userId
    ? await prisma.history.findMany({
        where: { clerkUserId: userId },
        orderBy: { updatedAt: "desc" },
        include: { media: true },
        take: 15,
      })
    : [];

  const cacheFn = dbCache(getHomeMediaInner, { tags: ["medias", "home"] });
  const data = await cacheFn();

  return { ...data, histories };
};

export const searchMedia = async (query?: string) => {
  if (!query) return [];
  return mediaService.search(query);
};

export const getMediaDetailsInner = async (payload: any) => {
  try {
    const valid = getMediaDetailsSchema.parse(payload);
    const media = await mediaService.details(valid);
    if (!media) throw new Error("Media not found");
    const seasonCount = await mediaService.countSeasons(payload);
    return { media, seasonCount };
  } catch (err) {
    console.error(err);
  }
};

export const getMediaDetails = async (payload: GetMediaDetailsType) => {
  const cacheFn = dbCache(getMediaDetailsInner, { tags: ["media", "home"] });
  return await cacheFn(payload);
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
