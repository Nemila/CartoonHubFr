// "use server";
// import { createPlayerSchema } from "@/components/forms/create-player-form";
// import prisma from "@/lib/prisma";
// import { asyncHandler } from "@/lib/utils";
// import { checkRole } from "@/server/roles";
// import { currentUser } from "@clerk/nextjs/server";
// import { MediaType } from "@prisma/client";
// import { revalidateTag } from "next/cache";
// import * as z from "zod";

// const protect = async () => {
//   const user = await currentUser();
//   if (!user) throw new Error("Not authorized");
//   const isStaff = (await checkRole("admin")) || (await checkRole("moderator"));
//   if (!isStaff) throw new Error(`Not authorized UserID: ${user.id}`);
// };

// export const addMedia = async (
//   _: CreateMediaResponse | null,
//   formData: FormData,
// ): Promise<CreateMediaResponse> => {
//   const schema = z.object({
//     tmdbId: z.coerce.number().min(1),
//     season: z.coerce.number().min(1),
//     mediaType: z.enum(["series", "movies"]),
//   });

//   try {
//     await protect();

//     const rawData = {
//       tmdbId: formData.get("tmdbId") as string,
//       season: formData.get("season") as string,
//       mediaType: formData.get("mediaType") as MediaType,
//     } satisfies CreateMediaPayload;

//     const valid = schema.safeParse(rawData);

//     if (valid.error) {
//       return {
//         msg: valid.error.errors[0].message,
//         payload: rawData,
//         error: true,
//       };
//     }

//     const newMedia = await mediaSe(
//       valid.data.mediaType,
//       valid.data.tmdbId,
//       valid.data.season,
//     );

//     return {
//       msg: "Created with success",
//       payload: rawData,
//       res: newMedia.id,
//       error: false,
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       msg: (error as Error).message,
//       error: true,
//     };
//   }
// };

// export const updateMedia = async (
//   _: UpdateMediaResponse | null,
//   formData: FormData,
// ): Promise<UpdateMediaResponse> => {
//   const schema = z.object({
//     id: z.string(),
//     tmdbId: z.coerce.number().min(1),
//     season: z.coerce.number().min(1),
//     title: z.string(),
//     originalTitle: z.string(),
//     overview: z.string().optional(),
//     releaseDate: z.string().optional(),
//     posterPath: z.string().optional(),
//     backdropPath: z.string().optional(),
//     mediaType: z.enum(["series", "movies"]),
//     popularity: z.coerce.number().optional(),
//     rating: z.coerce.number().optional(),
//     alternativeTitles: z.string().optional(),
//     trailerPath: z.string().optional(),
//   });

//   try {
//     await protect();

//     const rawData = {
//       tmdbId: formData.get("tmdbId") as string,
//       season: formData.get("season") as string,
//       mediaType: formData.get("mediaType") as string,
//       id: formData.get("id") as string,
//       title: formData.get("title") as string,
//       originalTitle: formData.get("originalTitle") as string,
//       overview: formData.get("overview") as string,
//       releaseDate: formData.get("releaseDate") as string,
//       posterPath: formData.get("posterPath") as string,
//       backdropPath: formData.get("backdropPath") as string,
//       popularity: formData.get("popularity") as string,
//       rating: formData.get("rating") as string,
//       trailerPath: formData.get("trailerPath") as string,
//       alternativeTitles: formData.get("alternativeTitles") as string,
//     } satisfies UpdateMediaPayload;

//     const validatedData = schema.safeParse(rawData);

//     if (validatedData.error) {
//       return {
//         msg: `${validatedData.error.errors[0].path[0]}: ${validatedData.error.errors[0].message}`,
//         payload: rawData,
//         error: true,
//       };
//     }

//     const { id, trailerPath, ...rest } = validatedData.data;
//     const media = await prisma.media.update({
//       where: { id },
//       data: { ...rest, videos: { push: trailerPath } },
//     });

//     revalidateTag(`media-${media.mediaType}-${media.tmdbId}`);

//     return {
//       msg: "Updated with success",
//       payload: rawData,
//       res: media.id,
//       error: false,
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       msg: (error as Error).message,
//       error: true,
//     };
//   }
// };

// export const deleteMedia = async (_: any, formData: FormData) => {
//   try {
//     await protect();

//     const mediaType = formData.get("mediaType") as string;
//     const tmdbId = formData.get("tmdbId") as string;
//     const mediaId = formData.get("mediaId") as string;

//     const deleted = await prisma.media.delete({ where: { id: mediaId } });

//     revalidateTag(`media-${mediaType}-${tmdbId}`);
//     revalidateTag("medias");

//     return {
//       res: deleted,
//       error: false,
//       msg: `${deleted.id} deleted with success`,
//     };
//   } catch (error) {
//     console.error(error);
//     return { error: true, msg: (error as Error).message };
//   }
// };

// export const deleteEpisode = async (_: any, formData: FormData) => {
//   try {
//     await protect();

//     const mediaType = formData.get("mediaType") as string;
//     const tmdbId = formData.get("tmdbId") as string;
//     const episodeId = formData.get("episodeId") as string;
//     const deleted = await prisma.episode.delete({ where: { id: episodeId } });

//     revalidateTag(`media-${mediaType}-${tmdbId}`);
//     revalidateTag(`getRecentUpdates`);

//     return {
//       res: deleted,
//       error: false,
//       msg: `${deleted.id} deleted with success`,
//     };
//   } catch (error) {
//     console.error(error);
//     return { error: true, msg: (error as Error).message };
//   }
// };

// // EPISODES
// export const importEpisode = async (data: {
//   mediaType: MediaType;
//   mediaTmdbId: number;
//   season: number;
//   number: number;
//   url: string;
//   videoHostName: string;
//   languageName: string;
// }) => {
//   return asyncHandler(async () => {
//     const user = await currentUser();
//     if (!user) throw new Error("Not authorized");
//     const isStaff =
//       (await checkRole("admin")) || (await checkRole("moderator"));
//     if (!isStaff) throw new Error(`Not authorized UserID: ${user.id}`);

//     const {
//       languageName,
//       videoHostName,
//       url,
//       mediaType,
//       mediaTmdbId,
//       ...episodeData
//     } = data;

//     const newEpisode = await prisma.episode.create({
//       data: {
//         ...episodeData,
//         title: `Episode ${episodeData.number}`,
//         media: {
//           connect: {
//             mediaType_tmdbId_season: {
//               mediaType,
//               tmdbId: mediaTmdbId,
//               season: episodeData.season,
//             },
//           },
//         },
//         players: {
//           connectOrCreate: {
//             where: { url },
//             create: {
//               url,
//               languageName,
//               videoHostName,
//             },
//           },
//         },
//       },
//     });

//     return newEpisode;
//   }, "importEpisode");
// };

// // PLAYERS
// export const createPlayer = async (
//   data: z.infer<typeof createPlayerSchema>,
// ) => {
//   return asyncHandler(async () => {
//     const user = await currentUser();
//     if (!user) throw new Error("Not authorized");
//     const isStaff =
//       (await checkRole("admin")) || (await checkRole("moderator"));
//     if (!isStaff) throw new Error(`Not authorized UserID: ${user.id}`);

//     const playerExists = await prisma.player.findUnique({
//       where: { url: data.url },
//     });
//     if (playerExists) throw new Error(`Player already exists`);
//     const newPlayer = await prisma.player.create({ data });

//     revalidateTag(`media`);

//     return newPlayer;
//   }, "createPlayer");
// };
