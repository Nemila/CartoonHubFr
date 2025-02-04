import ProviderService from "@/services/provider";
import { dbCache } from "@/lib/utils";

const providerService = new ProviderService();
export const getWatchProvidersCached = async () => {
  // TODO: IMPROVE CACHE KEY
  const cacheFn = dbCache(providerService.getAll);
  return cacheFn();
};
