"use server";
import prisma from "@/lib/prisma";
import { createHistorySchema, createHistoryType } from "@/schema/history";

export const createHistory = async (payload: createHistoryType) => {
  try {
    const valid = createHistorySchema.parse(payload);
    await prisma.history.upsert({
      where: {
        clerkUserId_mediaId: {
          clerkUserId: valid.userId,
          mediaId: valid.mediaId,
        },
      },
      create: {
        clerkUserId: valid.userId,
        episode: valid.episode,
        media: {
          connect: { id: valid.mediaId },
        },
      },
      update: {
        clerkUserId: valid.userId,
        episode: valid.episode,
        media: {
          connect: { id: valid.mediaId },
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
};
