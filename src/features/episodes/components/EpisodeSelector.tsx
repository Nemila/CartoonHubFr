"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EpisodeCard from "@/features/episodes/components/EpisodeCard";
import { Prisma } from "@prisma/client";
import { Image as ImageIcon, List } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

type Props = {
  episodes: Prisma.episodeGetPayload<{ include: { players: true } }>[];
};

const EpisodeSelector = ({ episodes }: Props) => {
  const [filter, setFilter] = useState("");
  const [display, setDisplay] = useQueryState(
    "display",
    parseAsString.withDefault("card"),
  );

  return (
    <Card className="flex max-h-[521.6px] w-full flex-col">
      <div className="flex gap-1 border-b p-1">
        <Input
          onChange={(e) => setFilter(e.currentTarget.value)}
          placeholder="Filtrer les episodes"
          value={filter}
        />
        <Button
          onClick={() => setDisplay(display === "card" ? "list" : "card")}
          className="shrink-0"
          variant={"outline"}
          size={"icon"}
        >
          {display === "card" ? <ImageIcon /> : <List />}
        </Button>
      </div>

      <div className="grid h-full grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-1 overflow-y-auto p-1.5">
        {episodes.map((item) => {
          const show = `${item.number}`.includes(filter);
          if (show) return <EpisodeCard episode={item} key={item.id} />;
        })}
      </div>
    </Card>
  );
};

export default EpisodeSelector;
