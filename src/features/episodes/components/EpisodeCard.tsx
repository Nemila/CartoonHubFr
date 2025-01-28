import { Episode } from "@prisma/client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  episode: Episode;
  currentEpisode: number;
};

const EpisodeCard = ({ episode, currentEpisode }: Props) => {
  return (
    <Link href={String(episode.number)}>
      <Card
        className={cn(
          "group flex h-28 overflow-hidden bg-stone-800",
          currentEpisode === episode.number && "bg-stone-700",
        )}
      >
        <div className="relative aspect-[4/2.8] h-full overflow-hidden">
          <Image
            className="size-full object-cover object-center transition-all group-hover:scale-110"
            src={episode.stillPath || "/no-video.png"}
            alt={episode.title}
            height={500}
            width={500}
            unoptimized
          />

          <Badge
            className="absolute bottom-1 left-1 rounded-md"
            variant={"secondary"}
          >
            EP {episode.number}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col items-start justify-between gap-1 p-2 text-xs">
          <div>
            <p className="line-clamp-1 text-sm font-semibold">
              {episode.title || `Episode ${episode.number}`}
            </p>

            <p className="line-clamp-2">
              {episode.description || "Aucune description"}
            </p>
          </div>

          <Badge
            variant={"outline"}
            className="mt-auto rounded-sm border-none bg-stone-900"
          >
            {episode.rating.toFixed(0)} / 10
          </Badge>
        </div>
      </Card>
    </Link>
  );
};

export default EpisodeCard;
