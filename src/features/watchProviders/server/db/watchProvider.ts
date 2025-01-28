import prisma from "@/lib/prisma";

export default class WatchProviderService {
  getAll = async () =>
    await prisma.watchProvider.findMany({
      orderBy: { priority: "asc" },
    });
}
