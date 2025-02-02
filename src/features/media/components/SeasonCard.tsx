import Link from "next/link";
import { Card } from "@/components/ui/card";
import { media } from "@prisma/client";
import Image from "next/image";

type Props = { media: media; seasonNumber: number };

const SeasonCard = ({ media, seasonNumber }: Props) => {
  return (
    <Link
      prefetch={false}
      href={`/${media.mediaType}/${media.tmdbId}/${seasonNumber}`}
    >
      <Card className="group relative h-full min-h-24 overflow-hidden transition-all">
        <Image
          className="left-0 top-0 size-full object-cover object-center transition-all group-hover:scale-110"
          src={media.backdropPath || "/poster.png"}
          alt={media.title + " saison " + seasonNumber}
          title={media.title + " saison " + seasonNumber}
          height={500}
          width={500}
          unoptimized
        />

        <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/70">
          <p className="font-medium">Saison {seasonNumber}</p>
        </div>
      </Card>
    </Link>
  );
};

export default SeasonCard;
