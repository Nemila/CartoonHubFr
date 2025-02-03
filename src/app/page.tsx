import { getHomeMedia } from "@/actions/media";
import Featured from "@/components/Featured";
import HomeMediaGrid from "@/components/HomeMediaGrid";
import HorizontalCard from "@/components/HorizontalCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

const Home = async () => {
  const [trending, newReleases, popularSeriesLastYear, popularMoviesLastYear] =
    await getHomeMedia();

  return (
    <main className="flex flex-col gap-4 py-4">
      <Featured media={trending.slice(0, 5)} />

      <div className="flex flex-col gap-4 lg:flex-row">
        <HomeMediaGrid
          data={{
            popularity: trending,
            createdAt: newReleases,
          }}
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row lg:max-w-sm lg:flex-col">
            <Card className="flex flex-1 flex-col gap-4 p-4">
              <div>
                <MessageCircle className="mb-2 size-7 fill-foreground" />
                <p className="text-xl font-bold">Rejoignez notre Discord</p>
                <p className="text-sm">
                  Rejoignez notre Discord pour rester informé et participer à la
                  communauté CartoonHub.
                </p>
              </div>

              <div className="mt-auto flex gap-4">
                <Button size={"lg"} className="flex-1 font-semibold" asChild>
                  <Link
                    target="_blank"
                    href="https://discord.com/invite/2Cj7ATwvQT"
                  >
                    Rejoindre la communauté
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="flex flex-1 flex-col gap-4 p-4">
              <div>
                <p className="text-xl font-bold">Donations</p>
                <p className="text-sm">
                  Le site coûte cher à maintenir. Faites un don pour qu&apos;il
                  ne disparaisse pas. Si chacun donne 1€, nous serons sauvés.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col text-xs">
                    <span className="text-lg font-bold">$200</span>
                    <span>Objectif : $10</span>
                  </div>

                  <div className="flex flex-col text-right text-xs">
                    <span className="text-lg font-bold">10%</span>
                    <span>de l&apos;objectif atteint</span>
                  </div>
                </div>

                <Progress className="w-full" value={10} />
              </div>

              <div className="mt-auto flex">
                <Button size={"lg"} className="flex-1 font-semibold" asChild>
                  <Link
                    target="_blank"
                    href="https://www.paypal.com/paypalme/cartoonhub
"
                  >
                    Faire un don
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          <div className="flex w-full flex-col gap-4 md:flex-row lg:max-w-sm lg:flex-col">
            <Card className="flex w-full flex-col gap-2 border-none p-2">
              <div className="text-xl font-bold">
                Top Séries {new Date().getFullYear() - 1}
              </div>

              <div className="flex flex-col gap-2">
                {popularSeriesLastYear.slice(0, 5).map((item) => (
                  <HorizontalCard key={item.id} data={item} />
                ))}
              </div>
            </Card>

            <Card className="flex w-full flex-col gap-2 border-none p-2">
              <div className="text-xl font-bold">
                Top Films {new Date().getFullYear() - 1}
              </div>

              <div className="flex flex-col gap-2">
                {popularMoviesLastYear.slice(0, 5).map((item) => (
                  <HorizontalCard key={item.id} data={item} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
