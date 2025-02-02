import Image from "next/image";
import React from "react";
import { Badge } from "./ui/badge";
import { CalendarDays, Star } from "lucide-react";
import Link from "next/link";

const HorizontalCard = () => {
  return (
    <Link
      href={"/"}
      className="bg-dark-2 group flex h-[100px] items-center rounded-lg outline-none ring-ring transition-all hover:-translate-x-1 hover:ring-1 focus-visible:-translate-x-1 focus-visible:ring-1"
    >
      <figure className="aspect-[3/4] h-full shrink-0 overflow-hidden rounded-lg">
        <Image
          alt="poster"
          title="poster"
          src={
            "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx176301-AclxpmzlKoBM.jpg"
          }
          width={500}
          height={500}
          className="size-full object-cover object-center"
        />
      </figure>

      <div className="flex h-full flex-col p-2">
        <p className="line-clamp-2 text-sm font-normal transition-all group-hover:text-secondary group-focus:text-secondary md:text-base">
          The Apothecary Diaries Saison 2
        </p>

        <div className="mt-1 flex items-center gap-1">
          <Badge variant={"outline"} className="h-fit px-1.5">
            <Star className="mr-1 size-2.5 fill-white stroke-white" />8
          </Badge>

          <Badge variant={"outline"} className="h-fit px-1.5">
            TV
          </Badge>

          <Badge variant={"outline"} className="h-fit px-1.5">
            <svg
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
            </svg>
            2025
          </Badge>
        </div>

        <small className="mt-1">Released</small>
      </div>
    </Link>
  );
};

export default HorizontalCard;
