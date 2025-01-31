import Player from "@/components/player";
import TrailerPlayer from "@/components/TrailerPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EpisodeSelector from "@/features/episodes/components/EpisodeSelector";
import SeasonCard from "@/features/media/components/SeasonCard";
import {
  getHomeMedia,
  getMediaDetailsBatchCached,
} from "@/features/media/server/actions/media";
import { checkRole } from "@/server/roles";
import { MediaType } from "@prisma/client";
import { ArrowLeftRight } from "lucide-react";
import { Metadata } from "next";
import { ResolvingMetadata } from "next/dist/lib/metadata/types/metadata-interface";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    mediaType: string;
    tmdbId: string;
    episode: string;
    season: string;
  }>;
};

export const revalidate = 259200;
export const dynamicParams = true;

export async function generateStaticParams() {
  const [trending, newReleases] = await getHomeMedia();
  return [...trending, ...newReleases].map((item) => ({
    tmdbId: String(item.tmdbId),
    mediaType: item.mediaType,
    season: String(item.season),
    episode: "1",
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { mediaType, tmdbId, episode, season } = await params;

  const data = await getMediaDetailsBatchCached({
    mediaType: mediaType as MediaType,
    episode: Number(episode),
    season: Number(season),
    tmdbId: Number(tmdbId),
  });

  if (!data) return notFound();
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `Regardez ${data.media.title} (${data.media.originalTitle}) - Épisode ${data.episode?.number || 1} en Streaming`,
    description: data.episode?.description || data.media.overview,
    openGraph: {
      images: [data.media.backdropPath || previousImages[0]],
    },
  };
}

const WatchPage = async ({ params }: Props) => {
  const { mediaType, tmdbId, episode: episodeNumber, season } = await params;
  const data = await getMediaDetailsBatchCached({
    mediaType: mediaType as MediaType,
    episode: Number(episodeNumber),
    season: Number(season),
    tmdbId: Number(tmdbId),
  });
  if (!data) return notFound();
  const { media, episode, payload } = data;
  const isStaff = await checkRole(["admin", "moderator"]);

  return (
    <main className="flex flex-col gap-4 py-4 lg:flex-row">
      <section className="flex flex-1 flex-col gap-2">
        <Player
          players={episode?.players || []}
          stillPath={episode?.stillPath}
          episodeNumber={episode?.number}
          totalEpisode={media.episodes.length}
        />

        <div className="lg:hidden">
          <EpisodeSelector
            currentEpisode={episode?.number}
            episodes={media.episodes}
          />
        </div>

        {episode && (
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex flex-col justify-between gap-1 lg:flex-row">
              <p className="text-lg font-bold">
                {episode?.number}. {episode?.title}
              </p>

              <div className="flex items-center gap-2">
                <Badge variant={"outline"} className="rounded-sm">
                  {episode?.releaseDate}
                </Badge>
                <Badge variant={"outline"} className="rounded-sm">
                  {episode?.rating.toFixed(1)} / 10
                </Badge>
                <Badge variant={"outline"} className="rounded-sm">
                  {episode?.runtime}m
                </Badge>
              </div>
            </div>

            <p className="text-sm">
              {episode?.description || "Aucune Description"}
            </p>

            <Card className="flex items-center gap-2 text-balance bg-stone-800 p-2 text-sm">
              <ArrowLeftRight className="size-4 shrink-0" />
              Si la vidéo ne fonctionne pas, essayez un autre lecteur ou
              rafraîchissez la page.
            </Card>
          </Card>
        )}

        <Card className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="flex shrink-0 flex-col gap-4 sm:max-w-[200px]">
            <Image
              className="aspect-[3/4.5] w-full rounded-md object-cover"
              src={media.posterPath || "/poster.png"}
              height={500}
              width={500}
              title={media.title}
              alt={media.title}
              unoptimized
            />

            <div className="flex flex-col gap-1">
              <Button variant={"outline"}>Regarder Plus Tard</Button>
              <Button variant={"outline"} asChild>
                <Link
                  prefetch={false}
                  href={`https://www.themoviedb.org/${payload.mediaType === "series" ? "tv" : "movie"}/${payload.tmdbId}`}
                >
                  Noter
                </Link>
              </Button>

              {isStaff && (
                <Button variant={"outline"} asChild>
                  <Link
                    prefetch={false}
                    href={`/admin/media/edit/${media.id}?ep=${episode?.id}`}
                  >
                    Modifier
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div>
              <p className="text-lg font-bold">{media.title}</p>
              <p>
                {media.originalTitle}, {media.alternativeTitles}
              </p>
            </div>

            <div className="flex-1 rounded-md bg-stone-800 p-2 text-sm">
              {media.overview || "Aucune description"}
            </div>

            <div className="space-y-2">
              <p className="font-medium">Plateformes de Streaming</p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(3.4rem,1fr))] gap-2">
                {media.watchProviders.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-md">
                    <Image
                      src={item.logoPath}
                      width={500}
                      height={500}
                      alt={item.name}
                      title={item.name}
                      className="size-full object-contain"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Chaines de television</p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
                {media.networks.map((item) => (
                  <div
                    key={item.id}
                    className="flex h-14 items-center justify-center overflow-hidden rounded-md bg-white px-4 py-2"
                  >
                    <Image
                      src={item.logoPath}
                      width={500}
                      height={500}
                      alt={item.name}
                      title={item.name}
                      className="size-full object-contain"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Genres</p>
              <div className="flex flex-wrap items-start justify-start gap-2">
                {media.genres.map((item) => (
                  <Badge
                    key={item.id}
                    className="rounded-sm"
                    variant={"secondary"}
                  >
                    {item.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {media.videos.length > 0 && <TrailerPlayer videos={media.videos} />}
      </section>

      <section className="flex w-full shrink-0 flex-col gap-4 lg:max-w-96">
        <div className="hidden lg:flex">
          <EpisodeSelector
            currentEpisode={episode?.number}
            episodes={media.episodes}
          />
        </div>

        {mediaType === "series" && (
          <Card className="overflow-hidden">
            <div className="border-b bg-stone-800 p-2 text-sm font-bold uppercase">
              Saisons
            </div>

            <div className="grid max-h-80 grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2 overflow-y-auto p-2">
              {Array.from({ length: data.seasonCount }).map((_, index) => (
                <SeasonCard
                  seasonNumber={index + 1}
                  media={media}
                  key={index}
                />
              ))}
            </div>
          </Card>
        )}
      </section>
    </main>
  );
};

export default WatchPage;
