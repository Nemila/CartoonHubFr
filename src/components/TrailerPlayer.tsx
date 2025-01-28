"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ReactPlayer from "react-player";
type Props = { videos: string[] };

const TrailerPlayer = ({ videos }: Props) => {
  const [videoId, setVideoId] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-video overflow-hidden rounded-md">
        <ReactPlayer
          url={videos[videoId]}
          width="100%"
          height="100%"
          controls
          playing
          muted
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2">
        {videos.map((item, index) => (
          <button
            key={item}
            onClick={() => setVideoId(index)}
            className={cn(
              "flex aspect-video w-full shrink-0 flex-col items-center justify-center gap-1 rounded-md bg-card bg-cover bg-center px-4 py-2",
              index === videoId && "rounded-md outline outline-red-500",
            )}
          >
            <p className={cn(index === videoId && "text-red-500")}>
              Video {index + 1}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrailerPlayer;
