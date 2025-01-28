import prisma from "@/lib/prisma";

export default class VideoHost {
  getAll = async () => {
    return await prisma.videoHost.findMany({
      orderBy: { priority: "asc" },
    });
  };
}
