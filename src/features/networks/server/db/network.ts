import prisma from "@/lib/prisma";

export default class NetworkService {
  getAll = async () => await prisma.network.findMany();
}
