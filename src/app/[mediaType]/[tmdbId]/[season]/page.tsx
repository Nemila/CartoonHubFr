import { getHomeMedia, getMediaDetails } from "@/actions/media";
import Player from "@/components/Player";
import TrailerPlayer from "@/components/TrailerPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EpisodeSelector from "@/features/episodes/components/EpisodeSelector";
import SeasonCard from "@/features/media/components/SeasonCard";
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
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { mediaType, tmdbId, season } = await params;

  const data = await getMediaDetails({
    mediaType: mediaType as MediaType,
    season: Number(season),
    tmdbId: Number(tmdbId),
  });
  if (!data) return notFound();
  const { media } = data;

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Regardez Gratuitement ${media.title} (${media.originalTitle}) en Francais`,
    description: media.overview,
    openGraph: {
      images: [data.media.backdropPath || previousImages[0]],
    },
  };
}

const WatchPage = async ({ params }: Props) => {
  const { mediaType, tmdbId, season } = await params;

  const data = await getMediaDetails({
    mediaType: mediaType as MediaType,
    season: Number(season),
    tmdbId: Number(tmdbId),
  });
  if (!data) return notFound();
  const { media, payload, seasonCount } = data;

  const isStaff = await checkRole(["admin", "moderator"]);

  return (
    <section className="flex flex-1 flex-col gap-2 py-2">
      <Player
        episodes={media.episodes}
        seasonCount={seasonCount}
        media={media}
      />

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
                <Link prefetch={false} href={`/admin/media/edit/${media.id}`}>
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
              {media.providers.map((item) => (
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
  );
};

export default WatchPage;
