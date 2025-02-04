import prisma from "@/lib/prisma";

export default class LanguageService {
  getAll = async () => {
    return await prisma.language.findMany();
  };
}
