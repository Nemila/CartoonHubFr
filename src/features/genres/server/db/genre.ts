import prisma from "@/lib/prisma";

export default class GenreService {
  getAll = async () => await prisma.genre.findMany();
}
