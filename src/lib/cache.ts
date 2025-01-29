import { MediaType } from "@prisma/client";
import { revalidateTag } from "next/cache";

export const getMediaGlobalTag = () => "media" as const;
export const getMediaTypeTag = (mediaType: MediaType) =>
  `media:${mediaType}` as const;
export const getMediaTmdbIdTag = (mediaType: MediaType, tmdbId: number) =>
  `media:${mediaType}-${tmdbId}` as const;
export const getMediaIdTag = (id: number) => `media:${id}` as const;

export type ValidTags =
  | ReturnType<typeof getMediaGlobalTag>
  | ReturnType<typeof getMediaTypeTag>
  | ReturnType<typeof getMediaTmdbIdTag>
  | ReturnType<typeof getMediaIdTag>;

export const clearFullCache = () => {
  revalidateTag("*");
  console.log("Full Cache Cleared");
};
