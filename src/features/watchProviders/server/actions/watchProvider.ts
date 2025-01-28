import WatchProviderService from "@/features/watchProviders/server/db/watchProvider";
import { dbCache } from "@/lib/utils";

const watchProviderService = new WatchProviderService();
export const getWatchProvidersCached = async () => {
  // TODO: IMPROVE CACHE KEY
  const cacheFn = dbCache(watchProviderService.getAll, {
    tags: ["watchProviders"],
  });
  return cacheFn();
};
