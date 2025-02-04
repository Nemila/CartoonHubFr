import HorizontalCard from "@/components/HorizontalCard";
import { Card } from "@/components/ui/card";
import { media } from "@prisma/client";
import React from "react";

type Props = {
  media: media[];
  title: string;
};

const AsideCardContainer = ({ media, title }: Props) => {
  return (
    <Card className="flex w-full flex-col gap-2 border-none p-2">
      <div className="text-xl font-bold">{title}</div>

      <div className="flex flex-col gap-2">
        {media.map((item) => (
          <HorizontalCard key={item.id} data={item} />
        ))}
      </div>
    </Card>
  );
};

export default AsideCardContainer;
