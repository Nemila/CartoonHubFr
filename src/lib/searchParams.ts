import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

const orderByArray = ["popularity", "rating"] as const;
export const catalogueSearchParams = {
  orderBy: parseAsStringLiteral(orderByArray)
    .withDefault("popularity")
    .withOptions({ clearOnDefault: false }),
  genre: parseAsString,
  network: parseAsString,
};
export const loadCatalogueSearchParams = createLoader(catalogueSearchParams);
