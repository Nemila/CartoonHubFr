"use client";
import { createHistory } from "@/actions/history";
import EpisodeSelector from "@/components/episode/EpisodeSelector";
import SeasonCard from "@/components/media/SeasonCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { ArrowLeftRight, Clock, FastForward, Rewind, Star } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";

type Props = {
  seasonCount: number;
  media: Prisma.mediaGetPayload<{
    include: {
      episodes: {
        include: {
          players: true;
        };
      };
    };
  }>;
};

const Player = ({ media, seasonCount }: Props) => {
  const { user } = useUser();
  const [number, setNumber] = useQueryState(
    "ep",
    parseAsInteger.withDefault(media.episodes[0].number),
  );
  const [playerId, setPlayerId] = useQueryState(
    "player",
    parseAsInteger.withDefault(media.episodes[0].players[0].id),
  );

  const episode = useMemo(() => {
    if (media.episodes.length < 1) return null;
    const findEpisode = media.episodes.find((ep) => ep.number === number);
    const episode = findEpisode || media.episodes[0];
    if (!episode) return null;
    return episode;
  }, [media.episodes, number]);

  const player = useMemo(() => {
    if (!episode) return null;
    const players = episode.players;
    const findPlayer = players.find((pl) => pl.id === playerId);
    const player = findPlayer || players[0];
    if (!player) return null;
    setPlayerId(player.id);
    return player;
  }, [episode, playerId, setPlayerId]);

  useEffect(() => {
    const controller = new AbortController();
    if (episode && user) {
      setTimeout(
        async () => {
          await createHistory({
            episode: episode.number,
            mediaId: media.id,
            userId: user.id,
          });
        },
        3000,
        { signal: controller.signal },
      );
    }

    return () => controller.abort();
  }, [episode, media.id, user]);

  return (
    <>
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-dark-1">
        {player ? (
          <iframe
            src={`${player.url}?thumbnail=${episode?.stillPath || media.backdropPath}`}
            title="CartoonHub Video Player"
            allow="encrypted-media"
            className="size-full"
            allowFullScreen
          ></iframe>
        ) : (
          <p className="text-4xl font-bold text-muted-foreground">
            Aucun Lecteurs
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Select
          onValueChange={(value) => setPlayerId(Number(value))}
          defaultValue={String(playerId)}
          value={String(playerId)}
        >
          <SelectTrigger className="flex-1 capitalize">
            <SelectValue placeholder="Lecteur" />
          </SelectTrigger>

          <SelectContent className="capitalize">
            {episode?.players.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.hostName} (
                <span className="uppercase">{item.languageName}</span>)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={"ghost"}
          onClick={() => setNumber(number - 1)}
          disabled={number <= media.episodes[0].number}
        >
          <Rewind className="fill-white stroke-white group-hover:fill-secondary group-hover:stroke-secondary" />
          Precedent
        </Button>

        <Button
          variant={"ghost"}
          onClick={() => setNumber(number + 1)}
          disabled={number >= media.episodes[media.episodes.length - 1].number}
        >
          Suivant
          <FastForward className="fill-white stroke-white group-hover:fill-secondary group-hover:stroke-secondary" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2 rounded-lg bg-dark-1 p-2">
        <div className="flex flex-col justify-between gap-1 lg:flex-row">
          <p className="text-lg font-bold">
            {episode?.number}. {episode?.title || "Aucun titre"}
          </p>

          <div className="flex items-center gap-2">
            <Badge>
              {episode?.releaseDate
                ? new Date(episode.releaseDate).getFullYear()
                : "??"}
            </Badge>

            <Badge>
              <Star className="mr-1.5 size-3 fill-white stroke-white" />
              {episode?.rating.toFixed(0) || 0}
            </Badge>

            <Badge>
              <Clock className="mr-1.5 size-3" />
              {episode?.runtime || 0}
            </Badge>
          </div>
        </div>

        <p className="text-sm">
          {episode?.description || "Aucune Description"}
        </p>

        <div className="flex items-center gap-2 text-balance rounded-lg bg-dark-2 px-3 py-2 text-xs">
          <ArrowLeftRight className="size-4 shrink-0" />
          Si la vidéo ne fonctionne pas, essayez un autre lecteur ou
          rafraîchissez la page.
        </div>
      </div>

      <div className="flex flex-col lg:hidden">
        <EpisodeSelector episodes={media.episodes} />

        {media.mediaType === "series" && (
          <div className="flex w-full flex-col">
            <div className="text-lg font-medium">Saisons</div>
            <div className="grid h-full grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-1 overflow-y-auto p-1.5">
              {Array.from({ length: seasonCount }).map((_, i) => (
                <SeasonCard key={i} media={media} seasonNumber={i + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Player;
