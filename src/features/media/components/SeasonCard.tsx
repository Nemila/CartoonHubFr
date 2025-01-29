import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Media } from "@prisma/client";
import Image from "next/image";

type Props = { media: Media; seasonNumber: number };
const SeasonCard = ({ media, seasonNumber }: Props) => {
  return (
    <Link
      prefetch={false}
      href={`/${media.mediaType}/${media.tmdbId}/${seasonNumber}/1`}
    >
      <Card className="group relative h-24 overflow-hidden transition-all">
        <Image
          className="left-0 top-0 size-full object-cover object-center transition-all group-hover:scale-110"
          src={media.backdropPath || "/poster.png"}
          height={500}
          width={500}
          unoptimized
          alt=""
        />

        <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/70">
          <p className="font-medium">Saison {seasonNumber}</p>
        </div>
      </Card>
    </Link>
  );
};

export default SeasonCard;
