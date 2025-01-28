"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Player as PlayerType } from "@prisma/client";
import { FastForward, Rewind } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  players: PlayerType[];
  stillPath?: string | null;
  episodeNumber?: number;
  totalEpisode?: number;
};

const Player = ({
  players,
  stillPath,
  episodeNumber,
  totalEpisode = 1,
}: Props) => {
  const router = useRouter();
  const [playerId, setPlayerId] = useState(players[0]?.id || "");
  const currentPlayer = useMemo(() => {
    return players.find((item) => item.id === playerId);
  }, [playerId, players]);

  return (
    <>
      <Card className="flex aspect-video items-center justify-center overflow-hidden border-y bg-card">
        {currentPlayer ? (
          <iframe
            className="h-full w-full"
            src={`${currentPlayer.url}?thumbnail=${stillPath}`}
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
          onValueChange={(value) => setPlayerId(value)}
          defaultValue={playerId}
        >
          <SelectTrigger className="flex-1 bg-card capitalize">
            <SelectValue placeholder="Lecteur" />
          </SelectTrigger>

          <SelectContent className="capitalize">
            {players.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.videoHostName} (
                <span className="uppercase">{item.languageName}</span>)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={"outline"}
          onClick={() => episodeNumber && router.push(`${episodeNumber - 1}`)}
          disabled={!episodeNumber || episodeNumber <= 1}
        >
          <Rewind className="fill-foreground" />
          Precedent
        </Button>

        <Button
          disabled={!episodeNumber || episodeNumber >= totalEpisode}
          onClick={() => episodeNumber && router.push(`${episodeNumber + 1}`)}
          variant={"outline"}
        >
          Suivant
          <FastForward className="fill-foreground" />
        </Button>
      </div>
    </>
  );
};

export default Player;
