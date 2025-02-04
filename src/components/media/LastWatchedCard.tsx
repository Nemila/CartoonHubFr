"use client";
import { Prisma } from "@prisma/client";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BLUR_DATA } from "@/lib/data";

type Props = {
  data: Prisma.historyGetPayload<{
    include: {
      media: true;
    };
  }>;
};

const LastWatchedCard = ({ data }: Props) => {
  return (
    <Link
      prefetch={false}
      href={`/${data.media.mediaType}/${data.media.tmdbId}/${data.media.season}?ep=${data.episode}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-dark-1 outline-none ring-ring focus:ring-1"
    >
      <figure className="relative aspect-video overflow-hidden">
        <Image
          src={data.media.backdropPath || data.media.posterPath || ""}
          className="size-full object-cover object-center transition-all group-hover:scale-110 group-focus:scale-110"
          blurDataURL={BLUR_DATA}
          placeholder="blur"
          height={500}
          unoptimized
          width={500}
          priority
          alt=""
        />
        <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50 group-focus:bg-opacity-50">
          <Play className="size-10 animate-bounce fill-white stroke-white opacity-0 group-hover:opacity-100 group-focus:opacity-100" />
        </div>

        <Badge
          variant={"secondary"}
          className="absolute bottom-2 left-2 flex"
          onClick={(e) => {
            e.stopPropagation();
            alert("Delete");
          }}
        >
          EP {data.episode}
        </Badge>
      </figure>

      <div className="p-2">
        <p className="line-clamp-1 text-sm">{data.media.title}</p>
      </div>
    </Link>
  );
};

export default LastWatchedCard;
