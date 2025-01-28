import { redirect } from "next/navigation";

const EpisodeSelectPage = async ({
  params,
}: {
  params: Promise<{ tmdbId: string }>;
}) => {
  const { tmdbId } = await params;
  return redirect(`${tmdbId}/1/1`);
};

export default EpisodeSelectPage;
