import { MediaType } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const dbCache = <T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: string[] },
) => {
  return cache(
    unstable_cache<T>(cb, undefined, {
      tags: [...tags, "*"],
      revalidate: Number.MAX_SAFE_INTEGER,
    }),
  );
};

export const extractMediaData = (title: string) => {
  const [name, type, id, season, episode] = title.toLowerCase().split("-");
  const tmdbId = Number(id);
  const seasonNumber = Number(/s(\d+)/.exec(season)?.[1]);
  const episodeNumber = Number(/e(\d+)/.exec(episode)?.[1]);
  const mediaType = type === "tv" ? "series" : "movies";

  if (!season || !tmdbId || !episode) throw new Error("Invalid name");
  return {
    name,
    tmdbId,
    seasonNumber,
    episodeNumber,
    mediaType: mediaType as MediaType,
  };
};

export const changePageSchema = z.object({
  page: z.coerce.number().min(1),
  orderBy: z.enum(["latest", "popularity", "rating"]),
  networks: z.union([z.string().min(24), z.literal("any")]),
  watchProviders: z.union([z.string().min(24), z.literal("any")]),
  genres: z.union([z.string().min(24), z.literal("any")]),
  mediaType: z.enum(["movies", "series", "any"]),
});
export type ChangePageType = z.infer<typeof changePageSchema>;

export const changePage = (data?: ChangePageType) => {
  return `?page=${data?.page || 1}&orderBy=${data?.orderBy || "popularity"}&networks=${data?.networks || "any"}&watchProviders=${data?.watchProviders || "any"}&genres=${data?.genres || "any"}&mediaType=${data?.mediaType || "any"}` as const;
};
