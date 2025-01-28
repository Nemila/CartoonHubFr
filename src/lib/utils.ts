import { MediaType } from "@prisma/client";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type ApiResponse<T> = {
  error: boolean;
  msg: string;
  res?: T;
};

export const dbCache = <T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags, revalidate = 3600 }: { tags: string[]; revalidate?: number },
) => {
  return cache(
    unstable_cache<T>(cb, undefined, {
      tags: [...tags, "*"],
      revalidate,
    }),
  );
};

export const asyncHandler = async <T>(
  caller: () => Promise<T>,
  calledId?: string,
): Promise<ApiResponse<T>> => {
  try {
    const data = await caller();
    return {
      error: false,
      msg: "OK",
      res: data,
    };
  } catch (error) {
    let msg = `Something went wrong CallerID: ${calledId}`;
    if (error instanceof z.ZodError) {
      msg = `${error.errors[0].message} CallerID: ${calledId}`;
    } else if (error instanceof AxiosError || error instanceof Error) {
      msg = `${error.message} CallerID: ${calledId}`;
    }
    console.error(msg);
    return { error: true, msg };
  }
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
