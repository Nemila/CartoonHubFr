import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type FindManyPayload = {
  distinct?: Prisma.MediaScalarFieldEnum[];
  orderBy?: Prisma.MediaOrderByWithRelationInput;
  where?: Prisma.MediaWhereInput;
  take?: number;
};

export default class PlayerService {
  findMany = async (payload?: FindManyPayload) => {
    return await prisma.media.findMany({
      where: payload?.where,
      take: payload?.take || 24,
      orderBy: payload?.orderBy || { popularity: "desc" },
      distinct: payload?.distinct,
    });
  };

  upsert = async (payload: Prisma.MediaCreateInput) => {
    return await prisma.media.upsert({
      where: {
        mediaType_tmdbId_season: {
          mediaType: payload.mediaType,
          tmdbId: payload.tmdbId,
          season: payload.season,
        },
      },
      update: payload,
      create: payload,
    });
  };

  delete = async (where: Prisma.MediaWhereUniqueInput) => {
    return await prisma.media.delete({ where });
  };

  findUnique = async (url: string) => {
    return await prisma.player.findUnique({ where: { url } });
  };
}
