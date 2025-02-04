import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BLUR_DATA } from "@/lib/data";
import { media } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type Props = {
  media: media[];
};

const Featured = ({ media }: Props) => {
  return (
    <Carousel>
      <CarouselContent>
        {media.map((item) => (
          <CarouselItem key={item.id}>
            <FeaturedItem data={item} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex items-center justify-center gap-4">
        <CarouselPrevious className="static translate-y-0 rounded-lg" />
        <CarouselNext className="static translate-y-0 rounded-lg" />
      </div>
    </Carousel>
  );
};

const FeaturedItem = async ({ data }: { data: media }) => {
  return (
    <div className="relative min-h-[60svh] overflow-hidden rounded-lg">
      <Image
        className="object-cover object-center"
        src={data.backdropPath || ""}
        blurDataURL={BLUR_DATA}
        placeholder="blur"
        alt="banner"
        unoptimized
        fill
      />

      <div className="absolute left-0 top-0 flex size-full items-end bg-gradient-to-t from-black to-transparent p-2 md:p-6">
        <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-end">
          <div className="flex max-w-lg flex-col gap-2 text-balance">
            <p className="line-clamp-2 text-2xl font-bold md:text-4xl">
              {data.title} - {data.originalTitle}
            </p>

            <div className="flex gap-2">
              <Badge variant={"outline"}>{data.rating.toFixed(0)} / 10</Badge>
              <Badge variant={"outline"}>{data.mediaType}</Badge>
              <Badge variant={"outline"}>{data.status}</Badge>
            </div>

            <div className="hidden md:flex">
              <p className="line-clamp-2">{data.overview}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild>
              <Link
                prefetch={false}
                href={`/${data.mediaType}/${data.tmdbId}/${data.season}`}
              >
                Regarder
              </Link>
            </Button>
            <Button variant={"ghost"}>Plus Tard</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
