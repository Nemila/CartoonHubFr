"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prisma } from "@prisma/client";
import { ArrowLeftRight, Clock, FastForward, Rewind, Star } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo } from "react";

type Props = {
  mediaBackdrop?: string;
  episodes: Prisma.episodeGetPayload<{
    include: {
      players: true;
    };
  }>[];
};

const Player = ({ episodes, mediaBackdrop }: Props) => {
  const [number, setNumber] = useQueryState(
    "ep",
    parseAsInteger.withDefault(episodes[0].number),
  );
  const [playerId, setPlayerId] = useQueryState(
    "player",
    parseAsInteger.withDefault(episodes[0].players[0].id),
  );

  const episode = useMemo(() => {
    if (episodes.length < 1) return null;
    const findEpisode = episodes.find((ep) => ep.number === number);
    const episode = findEpisode || episodes[0];
    if (!episode) return null;
    return episode;
  }, [episodes, number]);

  const player = useMemo(() => {
    if (!episode) return null;
    const players = episode.players;
    const findPlayer = players.find((pl) => pl.id === playerId);
    const player = findPlayer || players[0];
    if (!player) return null;
    setPlayerId(player.id);
    return player;
  }, [episode, playerId, setPlayerId]);

  return (
    <>
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-dark-1">
        {player ? (
          <iframe
            src={`${player.url}?thumbnail=${episode?.stillPath || mediaBackdrop}`}
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
          disabled={number <= episodes[0].number}
        >
          <Rewind className="fill-white stroke-white group-hover:fill-secondary group-hover:stroke-secondary" />
          Precedent
        </Button>

        <Button
          variant={"ghost"}
          onClick={() => setNumber(number + 1)}
          disabled={number >= episodes[episodes.length - 1].number}
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
    </>
  );
};

export default Player;
