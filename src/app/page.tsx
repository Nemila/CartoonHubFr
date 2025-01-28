import DonationCard from "@/components/DonationCard";
import MediaCard from "@/features/media/components/MediaCard";
import prisma from "@/lib/prisma";

const Home = async () => {
  const data = await prisma.media.findMany({
    take: 36,
    orderBy: { popularity: "desc" },
    distinct: ["originalTitle"],
  });

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
