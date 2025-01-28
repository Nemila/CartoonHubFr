"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EpisodeCard from "@/features/episodes/components/EpisodeCard";
import { Episode } from "@prisma/client";
import { useState } from "react";

type Props = {
  episodes: Episode[];
  currentEpisode: number;
};

const EpisodeSelector = ({ episodes, currentEpisode }: Props) => {
  const [number, setNumber] = useState("");

  return (
    <Card className="flex flex-1 flex-col">
      <div className="border-b p-2">
        <Input
          onChange={(e) => setNumber(e.currentTarget.value)}
          placeholder="Filtrer les episodes"
          value={number}
          className="border-none"
        />
      </div>

      <div className="grid h-full max-h-[488px] flex-1 grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-2 overflow-y-auto p-2">
        {episodes.map(
          (item) =>
            `${item.number}`.includes(number) && (
              <EpisodeCard
                currentEpisode={currentEpisode}
                episode={item}
                key={item.id}
              />
            ),
        )}
      </div>
    </Card>
  );
};

export default EpisodeSelector;
