import MediaService from "@/features/media/server/db/media";
import prisma from "@/lib/prisma";

export const GET = async () => {
  const perPage = 21;
  const totalMedia = 21 | 4571;
  const pages = Math.floor(totalMedia / perPage);

  const mediaService = new MediaService();

  for (let i = 0; i < totalMedia; i++) {
    console.log(`Page ${i}/${pages}`);

    const medias = await prisma.media.findMany({
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

    for (const media of medias) {
      console.log("Updating media", media.title);

      const mediaCreateInput =
        media.mediaType === "series"
          ? await mediaService.getSerieCreateInput(media.tmdbId, media.season)
          : await mediaService.getMovieCreateInput(media.tmdbId);

      const newMedia = await mediaService.upsert(mediaCreateInput);

      console.log("Media updated", newMedia.title);
    }
  }

  return Response.json({ msg: "Hello World" });
};
