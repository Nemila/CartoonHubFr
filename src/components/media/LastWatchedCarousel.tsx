"use client";
import { Prisma } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import LastWatchedCard from "./LastWatchedCard";

type Props = {
  histories: Prisma.historyGetPayload<{
    include: { media: true };
  }>[];
};

const LastWatchedCarousel = ({ histories }: Props) => {
  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto",
      }}
    >
      <CarouselContent>
        {histories.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-[90%] sm:basis-[55%] md:basis-[40%] lg:basis-1/4"
          >
            <LastWatchedCard data={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export default LastWatchedCarousel;
