import { Badge } from "@/components/ui/badge";
import { media } from "@prisma/client";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BLUR_DATA } from "@/lib/data";

type Props = { data: media };

const MediaCard = ({ data }: Props) => {
  return (
    <Link
      prefetch={false}
      className="group flex flex-col gap-2 rounded-md outline-none ring-ring focus-visible:ring-1"
      href={`/${data.mediaType}/${data.tmdbId}/${data.season}`}
    >
      <figure className="aspect-[3/4.5] w-full overflow-hidden rounded-md transition-all group-hover:-translate-y-2 group-focus:-translate-y-2">
        <Image
          className="size-full object-cover object-center"
          src={data.posterPath || "/poster.png"}
          blurDataURL={BLUR_DATA}
          placeholder="blur"
          title={data.title}
          alt={data.title}
          height={500}
          width={500}
          unoptimized
          priority
        />
      </figure>

      <div>
        <p className="line-clamp-1 text-sm font-medium group-hover:text-secondary group-focus:text-secondary">
          {data.title}
        </p>

        <div className="mt-1 flex items-center gap-1">
          <Badge variant={"outline"}>
            <Star className="mr-1 size-2.5 fill-white stroke-white" />
            {data.rating.toFixed(0)}
          </Badge>

          <Badge variant={"outline"}>
            {data.mediaType === "series" ? "TV" : "Movie"}
          </Badge>

          <Badge variant={"outline"}>
            {new Date(data.releaseDate).getFullYear()}
          </Badge>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
