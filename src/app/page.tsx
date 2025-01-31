import DonationCard from "@/components/DonationCard";
import MediaCard from "@/features/media/components/MediaCard";
import { getHomeMediaInner } from "@/features/media/server/actions/media";

const Home = async () => {
  const [trending, newReleases] = await getHomeMediaInner();

  return (
    <main className="flex flex-col gap-8 py-8">
      <DonationCard />

      <section className="flex flex-col gap-4">
        <h2 className="text-4xl font-bold">Populaires</h2>
        <div className="cartoon-grid">  
          {trending.map((item) => (
            <MediaCard key={item.id} data={item} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-4xl font-bold">Derniers Ajouts</h2>
        <div className="cartoon-grid">
          {newReleases.map((item) => (
            <MediaCard key={item.id} data={item} />
          ))}
        </div>
      </section>
    </main>
  );
};
export default Home;
