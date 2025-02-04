import { MediaType } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const dbCache = <T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  params?: { tags: string[] },
) => {
  return cache(
    unstable_cache<T>(cb, undefined, {
      tags: [...(params?.tags || []), "*"],
      revalidate: Number.MAX_SAFE_INTEGER,
    }),
  );
};

export const extractMediaData = (title: string) => {
  const [name, type, id, season, episode] = title.toLowerCase().split("-");
  const tmdbId = Number(id);
  const seasonNumber = Number(/s(\d+)/.exec(season)?.[1]);
  const episodeNumber = Number(/e(\d+)/.exec(episode)?.[1]);
  const mediaType: MediaType = type === "tv" ? "series" : "movies";

  if (!season || !tmdbId || !episode) throw new Error("Invalid name");
  return {
    name,
    tmdbId,
    seasonNumber,
    episodeNumber,
    mediaType,
  };
};
