import { getHomeMedia, getMediaDetails } from "@/actions/media";
import Player from "@/components/Player";
import TrailerPlayer from "@/components/TrailerPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EpisodeSelector from "@/components/episode/EpisodeSelector";
import SeasonCard from "@/components/media/SeasonCard";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

export const revalidate = 259200;
export const dynamicParams = true;

const watchPageParamsSchema = z.object({
  mediaType: z.enum(["series", "movies"]),
  season: z.coerce.number(),
  tmdbId: z.coerce.number(),
});

type Props = { params: Promise<z.infer<typeof watchPageParamsSchema>> };

export async function generateStaticParams() {
  const data = await getHomeMedia();
  if (!data) throw new Error("Cannot get media");
  const { trending } = data;

  return trending.map((item) => ({
    tmdbId: String(item.tmdbId),
    mediaType: item.mediaType,
    season: String(item.season),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const valid = watchPageParamsSchema.safeParse(await params);
  if (!valid.data) return notFound();

  const data = await getMediaDetails(valid.data);
  if (!data) return notFound();

  return {
    title: `Regardez Gratuitement ${data.media.title} (${data.media.originalTitle}) en Francais`,
    openGraph: { images: [data.media.backdropPath || "/og-image.png"] },
    description: data.media.overview,
  };
}

const WatchPage = async ({ params }: Props) => {
  const valid = watchPageParamsSchema.safeParse(await params);
  if (!valid.data) return notFound();

  const data = await getMediaDetails(valid.data);
  if (!data) return notFound();
  const { media, seasonCount } = data;

  return (
    <main className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[1fr,384px]">
      <section className="flex flex-col gap-2">
        <Player media={media} seasonCount={seasonCount} />

        <div className="flex flex-col gap-2 rounded-lg bg-dark-1 p-2 md:flex-row">
          <div className="flex w-full shrink-0 flex-col gap-2 md:max-w-[200px]">
            <figure className="aspect-[3/4.5] overflow-hidden rounded-lg">
              <Image
                className="size-full object-cover object-center"
                src={media.posterPath || "/poster.png"}
                title={media.title}
                alt={media.title}
                height={500}
                width={500}
                unoptimized
              />
            </figure>

            <div className="flex flex-col gap-2">
              <Button variant={"ghost"}>Plus Tard</Button>
              <Button variant={"ghost"} asChild>
                <Link
                  prefetch={false}
                  href={`https://www.themoviedb.org/${valid.data.mediaType === "series" ? "tv" : "movie"}/${valid.data.tmdbId}`}
                >
                  Noter
                </Link>
              </Button>

              {/* {isStaff && (
                <Button variant={"outline"} asChild>
                  <Link prefetch={false} href={`/admin/media/edit/${media.id}`}>
                    Modifier
                  </Link>
                </Button>
              )} */}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col">
              <p className="text-lg font-bold">{media.title}</p>
              <small>
                {media.originalTitle}, {media.alternativeTitles}
              </small>
            </div>

            <div className="rounded-lg bg-dark-2 p-2 text-sm">
              {media.overview || "Aucune description"}
            </div>

            {media.providers.length > 0 && (
              <div className="flex flex-col gap-1 font-medium">
                <p>Streaming</p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(3.4rem,1fr))] gap-2">
                  {media.providers.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-md">
                      <Image
                        className="size-full object-contain"
                        src={item.logoPath}
                        title={item.name}
                        alt={item.name}
                        height={500}
                        width={500}
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {media.networks.length > 0 && (
              <div className="flex flex-col gap-1 font-medium">
                <p>Television</p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
                  {media.networks.map((item) => (
                    <div
                      key={item.id}
                      className="flex h-14 items-center justify-center overflow-hidden rounded-md bg-white px-4 py-2"
                    >
                      <Image
                        className="size-full object-contain"
                        src={item.logoPath}
                        title={item.name}
                        alt={item.name}
                        height={500}
                        width={500}
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {media.genres.length > 0 && (
              <div className="flex flex-col gap-1 font-medium">
                <p>Genres</p>
                <div className="flex flex-wrap items-start justify-start gap-2">
                  {media.genres.map((item) => (
                    <Badge key={item.id}>{item.name}</Badge>
                  ))}
                </div>
              </div>
            )}

            {media.backdropImages.length > 0 && (
              <div className="flex flex-col gap-1 font-medium">
                <p>Backdrop Images</p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2">
                  {media.backdropImages.slice(0, 6).map((item) => (
                    <figure key={item} className="overflow-hidden rounded-lg">
                      <Image
                        className="size-full object-cover object-center"
                        height={500}
                        width={500}
                        src={item}
                        alt=""
                      />
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {media.posterImages.length > 0 && (
              <div className="flex flex-col gap-1 font-medium">
                <p>Posters Images</p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2">
                  {media.posterImages.slice(0, 6).map((item) => (
                    <figure key={item} className="overflow-hidden rounded-lg">
                      <Image
                        className="size-full object-cover object-center"
                        height={500}
                        width={500}
                        src={item}
                        alt=""
                      />
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="hidden w-full flex-col gap-2 lg:flex">
        <EpisodeSelector episodes={media.episodes} />

        {media.mediaType === "series" && (
          <div className="flex w-full flex-col">
            <div className="text-lg font-medium">Saisons</div>
            <div className="grid h-full grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-1 overflow-y-auto p-1.5">
              {Array.from({ length: seasonCount }).map((_, i) => (
                <SeasonCard key={i} media={media} seasonNumber={i + 1} />
              ))}
            </div>
          </div>
        )}

        {media.videos.length > 0 && <TrailerPlayer videos={media.videos} />}
      </section>
    </main>
  );
};

export default WatchPage;
