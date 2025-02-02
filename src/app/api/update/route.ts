import MediaService from "@/services/media";
import prisma from "@/lib/prisma";
import { unstable_noStore } from "next/cache";

export const GET = async () => {
  unstable_noStore();
  const perPage = 21;
  const totalMedia = 21 | 4571;
  const pages = Math.floor(totalMedia / perPage);

  const mediaService = new MediaService();

  for (let i = 0; i < totalMedia; i++) {
    console.log(`Page ${i}/${pages}`);

    const mediaList = await prisma.media.findMany({
      orderBy: { popularity: "desc" },
      skip: i * perPage,
      take: perPage,
      select: {
        mediaType: true,
        tmdbId: true,
        season: true,
        title: true,
      },
    });

    for (const media of mediaList) {
      console.log("Updating media", media.title);

      const newMedia = await mediaService.create({
        mediaType: media.mediaType,
        season: media.season,
        tmdbId: media.tmdbId,
      });

      console.log("Media updated", newMedia.title);
    }
  }

  return Response.json({ msg: "Hello World" });
};
