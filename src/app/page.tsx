import DonationCard from "@/components/DonationCard";
import MediaCard from "@/features/media/components/MediaCard";
import { getPopularCached } from "@/features/media/server/actions/media";

export const revalidate = 10800; // 3 HOURS
export const dynamicParams = true;

export async function generateStaticParams() {
  const media = await getPopularCached();
  return media.map((item) => ({
    tmdbId: String(item.tmdbId),
    mediaType: item.mediaType,
    season: String(item.season),
    episode: "1",
  }));
}

const Home = async () => {
  const data = await getPopularCached();
  return (
    <main className="flex flex-col gap-8 py-8">
      <DonationCard />
      <section className="flex flex-col gap-4">
        <h2 className="text-4xl font-bold">Populaires</h2>
        <div className="cartoon-grid">
          {data.map((item) => (
            <MediaCard key={item.id} data={item} />
          ))}
        </div>
      </section>
    </main>
  );
};
export default Home;
