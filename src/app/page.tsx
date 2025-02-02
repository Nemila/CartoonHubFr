import { getHomeMedia } from "@/actions/media";
import HomeFilter from "@/components/HomeFilter";
import HorizontalCard from "@/components/HorizontalCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MediaCard from "@/features/media/components/MediaCard";
import Image from "next/image";

const Home = async () => {
  const [trending, newReleases] = await getHomeMedia();

  return (
    <main className="flex flex-col gap-4 py-4">
      <div className="relative min-h-[60svh] overflow-hidden rounded-lg">
        <Image
          className="object-cover object-center"
          src={trending[1].backdropPath || ""}
          alt="banner"
          fill
        />

        <div className="absolute left-0 top-0 flex size-full items-end bg-gradient-to-t from-black to-transparent p-2 md:p-6">
          <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-end">
            <div className="flex max-w-lg flex-col gap-2 text-balance">
              <p className="line-clamp-2 text-2xl font-bold md:text-4xl">
                {trending[1].title} / {trending[1].originalTitle}
              </p>

              <div className="flex gap-2">
                <Badge variant={"outline"}>
                  {trending[1].rating.toFixed(0)} / 10
                </Badge>
                <Badge variant={"outline"}>{trending[1].mediaType}</Badge>
                <Badge variant={"outline"}>{trending[1].status}</Badge>
              </div>

              <div className="hidden md:flex">
                <p className="line-clamp-2">{trending[1].overview}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button>Regarder</Button>
              <Button variant={"ghost"}>Plus Tard</Button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex gap-2">
        <div className="bg-dark-0 size-24"></div>
        <div className="bg-dark-1 size-24"></div>
        <div className="bg-dark-2 size-24"></div>
        <div className="bg-dark-3 size-24"></div>
      </div> */}

      {/* <DonationCard /> */}

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <section className="flex flex-col gap-4">
            <HomeFilter />

            {/* <h2 className="text-3xl font-bold">Populaires</h2> */}
            <div className="cartoon-grid">
              {trending.map((item) => (
                <MediaCard key={item.id} data={item} />
              ))}
            </div>
          </section>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row lg:max-w-sm lg:flex-col">
          <Card className="flex w-full flex-col gap-2 border-none p-2">
            <div className="text-xl font-bold">Top Airing</div>

            <div className="flex flex-col gap-2">
              <HorizontalCard />
              <HorizontalCard />
              <HorizontalCard />
              <HorizontalCard />
            </div>
          </Card>

          <Card className="flex w-full flex-col gap-2 border-none p-2">
            <div className="text-xl font-bold">Top Airing</div>

            <div className="flex flex-col gap-2">
              <HorizontalCard />
              <HorizontalCard />
              <HorizontalCard />
              <HorizontalCard />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Home;
