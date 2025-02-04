import { media } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type Props = { media: media; seasonNumber: number };

const SeasonCard = ({ media, seasonNumber }: Props) => {
  return (
    <Link
      prefetch={false}
      href={`/${media.mediaType}/${media.tmdbId}/${seasonNumber}`}
      className="group relative overflow-hidden rounded-lg outline-none ring-secondary transition-all hover:ring-1 focus:ring-1"
    >
      <figure>
        <Image
          className="left-0 top-0 size-full object-cover object-center transition-all group-hover:scale-110 group-focus:scale-110"
          src={media.backdropPath || "/poster.png"}
          alt={media.title + " saison " + seasonNumber}
          title={media.title + " saison " + seasonNumber}
          height={500}
          width={500}
          unoptimized
        />
      </figure>

      <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black/70 group-hover:text-secondary group-focus:text-secondary">
        <p className="font-medium">Saison {seasonNumber}</p>
      </div>
    </Link>
  );
};

export default SeasonCard;
