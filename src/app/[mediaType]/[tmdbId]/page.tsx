import { redirect } from "next/navigation";

type Props = { params: Promise<{ tmdbId: string }> };
const EpisodeSelectPage = async ({ params }: Props) => {
  const { tmdbId } = await params;
  return redirect(`${tmdbId}/1`);
};

export default EpisodeSelectPage;
