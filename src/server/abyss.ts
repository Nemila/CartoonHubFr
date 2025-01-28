export const getFiles = async (page: number) => {
  const api_url = `https://api.hydrax.net/9d411365c675a87353180808c7365e0b/list?page=${page}`;
  const response = await fetch(api_url, {
    cache: "force-cache",
    next: { revalidate: 600, tags: ["abyss"] },
  });
  const json = await response.json();
  return json as AbyssListResponse;
};
