import prisma from "@/lib/prisma";

export default class VideoHost {
  getAll = async () => {
    return await prisma.host.findMany({
      orderBy: { priority: "asc" },
    });
  };
}
