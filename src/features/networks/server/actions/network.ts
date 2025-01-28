import NetworkService from "@/features/networks/server/db/network";
import { dbCache } from "@/lib/utils";

const networkService = new NetworkService();
export const getNetworksCached = async () => {
  // TODO: IMPROVE CACHE KEY
  const cacheFn = dbCache(networkService.getAll, { tags: ["networks"] });
  return cacheFn();
};
