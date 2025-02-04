"use client";
import { cn } from "@/lib/utils";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import { useState } from "react";

type Props = { videos: string[] };

const TrailerPlayer = ({ videos }: Props) => {
  const [videoId, setVideoId] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-video overflow-hidden rounded-lg border">
        <MediaPlayer
          src={`youtube/${videos[videoId].match(/v?=(.*)/)?.[1]}`}
          title="Trailer Player"
          className="size-full"
          autoPlay
          muted
        >
          <MediaProvider />
          <PlyrLayout icons={plyrLayoutIcons} />
        </MediaPlayer>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
        {videos.slice(0, 3).map((item, index) => (
          <button
            key={item}
            onClick={() => setVideoId(index)}
            className={cn(
              "group flex aspect-video w-full shrink-0 flex-col items-center justify-center gap-1 rounded-lg bg-dark-1 bg-cover bg-center px-4 py-2 outline-none ring-secondary hover:bg-dark-3 hover:ring-1 focus:bg-dark-3 focus:ring-1",
              index === videoId && "rounded-md bg-dark-2 ring-1",
            )}
          >
            <p
              className={cn(
                index === videoId && "text-secondary",
                "group-hover:text-secondary group-focus:text-secondary",
              )}
            >
              Video {index + 1}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrailerPlayer;
