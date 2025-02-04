import { z } from "zod";

const abyssFileSchema = z.object({
  name: z.string(),
  size: z.coerce.number(),
  slug: z.string(),
  resolution: z.coerce.number(),
  status: z.string(),
});

const abyssFileResponseSchema = z.object({
  items: abyssFileSchema.array(),
  pagination: z.object({
    current: z.coerce.number(),
    next: z.coerce.number(),
  }),
});

export const getFiles = async (page: number, name: string = "Lamine") => {
  const tokens = [
    {
      name: "Lamine",
      token: "9d411365c675a87353180808c7365e0b",
    },
    {
      name: "Erwan",
      token: "a5acf49042ba9651cc0cd26e1b6c55c3",
    },
  ];
  const token = tokens.find((item) => item.name === name);

  const api_url = `https://api.hydrax.net/${token?.token}/list?page=${page}`;
  const response = await fetch(api_url, {
    next: { revalidate: 600, tags: ["abyss"] },
    cache: "force-cache",
  });
  const json = await response.json();
  const data = abyssFileResponseSchema.parse(json);
  return data;
};
