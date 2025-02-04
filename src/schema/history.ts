import { z } from "zod";

export const createHistorySchema = z.object({
  episode: z.coerce.number(),
  mediaId: z.coerce.number(),
  userId: z.string(),
});
export type createHistoryType = z.infer<typeof createHistorySchema>;
