import { getHomeMedia } from "@/actions/media";
import Featured from "@/components/Featured";
import HomeMediaGrid from "@/components/layout/home/HomeMediaGrid";
import Sidebar from "@/components/layout/home/Sidebar";

const Home = async () => {
  const [trending, newReleases, popularSeriesLastYear, popularMoviesLastYear] =
    await getHomeMedia();

  return (
    <main className="flex flex-col gap-4 py-4">
      <Featured media={trending.slice(0, 5)} />

      <div className="flex flex-col gap-4 lg:flex-row">
        <section className="flex-1">
          <HomeMediaGrid
            data={{
              popularity: trending,
              createdAt: newReleases,
            }}
          />
        </section>

        <Sidebar
          series={popularSeriesLastYear.slice(0, 5)}
          movies={popularMoviesLastYear.slice(0, 5)}
        />
      </div>
    </main>
  );
};

export default Home;
