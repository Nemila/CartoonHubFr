import { getHomeMedia } from "@/actions/media";
import Featured from "@/components/layout/home/Featured";
import HomeMediaGrid from "@/components/layout/home/HomeMediaGrid";
import Sidebar from "@/components/layout/home/Sidebar";
import LastWatchedCarousel from "@/components/media/LastWatchedCarousel";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const Home = async () => {
  const user = await currentUser();
  const data = await getHomeMedia(user?.id);

  if (!data) notFound();
  const {
    trending,
    newRelease,
    popularMoviesLastYear,
    popularSeriesLastYear,
    histories,
  } = data;

  return (
    <main className="flex flex-col gap-4 py-4">
      <Featured media={trending.slice(0, 5)} />

      <div className="flex flex-col gap-2">
        <div>
          <p className="text-lg font-medium text-slate-400">Historique</p>
          <p className="text-2xl font-bold">Continuez Visionnage</p>
        </div>
        <LastWatchedCarousel histories={histories} />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <section className="flex-1">
          <HomeMediaGrid
            data={{
              popularity: trending,
              createdAt: newRelease,
            }}
          />
        </section>

        <aside className="flex w-full flex-col gap-4 lg:max-w-sm">
          <Sidebar
            series={popularSeriesLastYear.slice(0, 5)}
            movies={popularMoviesLastYear.slice(0, 5)}
          />
        </aside>
      </div>
    </main>
  );
};

export default Home;
