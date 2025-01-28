import DonationCard from "@/components/DonationCard";
import SkeletonGrid from "@/components/SkeletonGrid";
import MediaCard from "@/features/media/components/MediaCard";
import {
  getPopularCached,
  getRecentUpdatesCached,
} from "@/features/media/server/actions/media";
import { Suspense } from "react";

const Home = async () => {
  return (
    <main className="flex flex-col gap-8 py-8">
      <DonationCard />

      <section className="flex flex-col gap-4">
        <h2 className="text-4xl font-bold">Populaires</h2>
        <Suspense fallback={<SkeletonGrid />}>
          <Popular />
        </Suspense>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-4xl font-bold">Derniers Ajouts</h2>
        <Suspense fallback={<SkeletonGrid />}>
          <RecentUpdates />
        </Suspense>
      </section>
    </main>
  );
};
export default Home;

const Popular = async () => {
  const data = await getPopularCached();
  return (
    <div className="cartoon-grid">
      {data.map((item) => (
        <MediaCard key={item.id} data={item} />
      ))}
    </div>
  );
};

const RecentUpdates = async () => {
  const data = await getRecentUpdatesCached();
  return (
    <div className="cartoon-grid">
      {data.map((item) => (
        <MediaCard key={item.id} data={item} />
      ))}
    </div>
  );
};
