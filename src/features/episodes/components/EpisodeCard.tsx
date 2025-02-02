import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { episode } from "@prisma/client";
import { Star } from "lucide-react";
import Image from "next/image";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

type Props = { episode: episode };
const EpisodeCard = ({ episode }: Props) => {
  const [number, setNumber] = useQueryState("ep", parseAsInteger);
  const [display] = useQueryState("display", parseAsString);

  if (display === "list") {
    return (
      <button
        onClick={() => setNumber(episode.number)}
        title={`Episode ${episode.number}`}
        className={cn(
          "bg-dark-2 focus-visible:bg-dark-2 hover:bg-dark-3 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all hover:scale-[1.01] hover:ring-1 hover:ring-white focus-visible:scale-[1.01] active:hover:scale-[0.99]",
          number === episode.number &&
            "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:bg-secondary/90",
        )}
      >
        {episode.number === number ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span>{episode.number}.</span>
        )}

        <p>{episode.title || `Episode ${episode.number}`}</p>

        <p className="ml-auto flex items-center text-xs">
          <Star
            className={cn(
              "mr-1 size-3 fill-white stroke-white",
              episode.number === number &&
                "fill-secondary-foreground stroke-secondary-foreground",
            )}
          />
          {episode.rating?.toFixed(0)} / 10
        </p>
      </button>
    );
  }

  return (
    <button
      onClick={() => setNumber(episode.number)}
      title={`Episode ${episode.number}`}
      className={cn(
        "hover:bg-dark-2 focus-visible:bg-dark-2 rounded-md text-left transition-all hover:scale-[1.01] hover:ring-1 hover:ring-white focus-visible:scale-[1.01] active:hover:scale-[0.99]",
        number === episode.number &&
          "bg-dark-3 hover:bg-dark-3/90 focus-visible:bg-dark-3/90",
      )}
    >
      <div className={cn("group flex h-[110px]")}>
        <figure className="relative aspect-[1.6/1] h-[110px] shrink-0 overflow-hidden rounded-md">
          <Image
            className="size-full object-cover object-center"
            src={episode.stillPath || "/no-video.png"}
            alt={episode.title || `Episode ${episode.number}`}
            title={episode.title || `Episode ${episode.number}`}
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
        </figure>

        <div className="flex flex-col p-2">
          <p>{episode.title || `Episode ${episode.number}`}</p>
          <p className="line-clamp-3 text-xs font-thin">
            {episode.description || "Aucune description"}
          </p>
          <p className="mt-auto flex items-center text-xs">
            <Star className="mr-1 size-3 fill-white stroke-white" />
            {episode.rating?.toFixed(0)} / 10
          </p>
        </div>
      </div>
    </button>
  );
};

export default EpisodeCard;
