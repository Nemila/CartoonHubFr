import prisma from "@/lib/prisma";

export default class PlayerService {
  findUnique = async (url: string) => {
    return await prisma.player.findUnique({ where: { url } });
  };
}
