import { getPopularCached } from "@/features/media/server/actions/media";
import { redirect } from "next/navigation";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const media = await getPopularCached();
  return media.map((item) => ({
    tmdbId: String(item.tmdbId),
    mediaType: item.mediaType,
  }));
}

const EpisodeSelectPage = async ({
  params,
}: {
  params: Promise<{ tmdbId: string }>;
}) => {
  const { tmdbId } = await params;
  return redirect(`${tmdbId}/1/1`);
};

export default EpisodeSelectPage;
