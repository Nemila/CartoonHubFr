import prisma from "@/lib/prisma";

export default class ProviderService {
  getAll = async () => {
    return await prisma.provider.findMany({
      orderBy: { priority: "asc" },
    });
  };
}
