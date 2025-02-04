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
            {/* <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 size-2.5"
            >
              <path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
            </svg> */}
            {new Date(data.releaseDate).getFullYear()}
          </Badge>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
