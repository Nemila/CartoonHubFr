import { Media } from "@prisma/client";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = { data: Media };
const MediaCard = ({ data }: Props) => {
  return (
    <Link
      prefetch={false}
      className="flex flex-col gap-2"
      href={`/${data.mediaType}/${data.tmdbId}/${data.season}/1`}
    >
      <div className="group aspect-[3/4.5] w-full overflow-hidden rounded-md">
        <Image
          className="size-full object-cover object-center transition-all group-hover:scale-110"
          src={data.posterPath || "/poster.png"}
          title={data.title}
          alt={data.title}
          loading="eager"
          height={500}
          width={500}
          unoptimized
        />
      </div>

      <div className="text-sm">
        <p className="flex items-center justify-between">
          <span className="flex items-center justify-center">
            <Star className="mr-1 size-3.5 fill-primary stroke-primary" />
            {data.rating.toFixed(0)} / 10
          </span>
          <span className="capitalize">{data.mediaType}</span>
        </p>
        <p className="line-clamp-1 text-sm font-medium">{data.title}</p>
      </div>
    </Link>
  );
};

export default MediaCard;
