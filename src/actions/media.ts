"use server";
import prisma from "@/lib/prisma";
import {
  editMediaSchema,
  EditMediaType,
  getMediaDetailsSchema,
} from "@/schema/media";
import MediaService from "@/services/media";
import { revalidateTag } from "next/cache";

const mediaService = new MediaService();

export const getHomeMedia = async (userId?: string) => {
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

  const histories = userId
    ? await prisma.history.findMany({
        where: { clerkUserId: userId },
        orderBy: { updatedAt: "desc" },
        include: { media: true },
      })
    : [];

  return {
    trending,
    newRelease,
    popularSeriesLastYear,
    popularMoviesLastYear,
    histories,
  };
};

export const searchMedia = async (query?: string) => {
  if (!query) return [];
  return mediaService.search(query);
};

export const getMediaDetails = async (payload: any) => {
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
