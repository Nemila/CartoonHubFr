"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EpisodeSelector from "@/features/episodes/components/EpisodeSelector";
import SeasonCard from "@/components/media/SeasonCard";
import { Prisma } from "@prisma/client";
import { ArrowLeftRight, FastForward, Rewind } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo } from "react";

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

const PlayerSection = ({ media, seasonCount }: Props) => {
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

  return (
    <>
      <div className="flex flex-1 shrink-0 flex-col gap-2">
        <Card className="flex aspect-video items-center justify-center overflow-hidden border-y bg-card">
          {player ? (
            <iframe
              className="h-full w-full"
              src={`${player.url}?thumbnail=${episode?.stillPath || media.backdropPath}&logo=${process.env.NEXT_PUBLIC_BASE_URL + "/simple-logo-light.png"}`}
              allow="encrypted-media"
              allowFullScreen
              title="CartoonHub Video Player"
            />
          ) : (
            <p className="text-4xl font-bold text-muted-foreground">
              Aucun Lecteurs
            </p>
          )}
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            onValueChange={(value) => setPlayerId(Number(value))}
            defaultValue={String(playerId)}
            value={String(playerId)}
          >
            <SelectTrigger className="flex-1 bg-card capitalize">
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
            variant={"outline"}
            onClick={() => setNumber(number - 1)}
            disabled={number <= media.episodes[0].number}
          >
            <Rewind className="fill-foreground" />
            Precedent
          </Button>

          <Button
            variant={"outline"}
            onClick={() => setNumber(number + 1)}
            disabled={
              number >= media.episodes[media.episodes.length - 1].number
            }
          >
            Suivant
            <FastForward className="fill-foreground" />
          </Button>
        </div>

        {episode && (
          <Card className="flex flex-1 flex-col gap-3 p-4">
            <div className="flex flex-col justify-between gap-1 lg:flex-row">
              <p className="text-lg font-bold">
                {episode?.number}. {episode?.title}
              </p>

              <div className="flex items-center gap-2">
                <Badge variant={"outline"} className="rounded-sm">
                  {episode?.releaseDate}
                </Badge>
                <Badge variant={"outline"} className="rounded-sm">
                  {episode?.rating.toFixed(1)} / 10
                </Badge>
                <Badge variant={"outline"} className="rounded-sm">
                  {episode?.runtime}m
                </Badge>
              </div>
            </div>

            <p className="text-sm">
              {episode?.description || "Aucune Description"}
            </p>

            <Card className="flex items-center gap-2 text-balance bg-stone-800 p-2 text-sm">
              <ArrowLeftRight className="size-4 shrink-0" />
              Si la vidéo ne fonctionne pas, essayez un autre lecteur ou
              rafraîchissez la page.
            </Card>
          </Card>
        )}
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-2 lg:max-w-sm">
        <EpisodeSelector episodes={media.episodes} />

        {media.mediaType === "series" && (
          <Card className="flex max-h-52 flex-1 flex-col overflow-hidden">
            <div className="border-b bg-stone-800 p-2 text-sm font-bold uppercase">
              Saisons
            </div>

            <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2 overflow-y-auto p-2">
              {Array.from({ length: seasonCount }).map((_, index) => (
                <SeasonCard
                  seasonNumber={index + 1}
                  media={media}
                  key={index}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default PlayerSection;
