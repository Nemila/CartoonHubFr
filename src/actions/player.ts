import PlayerService from "@/services/player";
import { dbCache } from "@/lib/utils";

const playerService = new PlayerService();

export const checkPlayerExists = async (url: string) => {
  // TODO: ADD APPROPRIATE TAGS TO THIS
  const cacheFn = dbCache(playerService.findUnique, { tags: ["players"] });
  const playerExists = await cacheFn(url);
  return Boolean(playerExists);
};

