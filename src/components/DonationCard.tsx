"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DonationCard = () => {
  const [goal] = useState(200);
  const [totalContributions] = useState(0);
  const [progress] = useState((totalContributions * 100) / goal);

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="flex flex-col gap-4 p-4">
        <div>
          <p className="text-xl font-bold">Donations</p>
          <p className="text-sm">
            Le site coûte cher à maintenir. Faites un don pour qu&apos;il ne
            disparaisse pas. Si chacun donne 1€, nous serons sauvés.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col text-xs">
              <span className="text-lg font-bold">${totalContributions}</span>
              <span>Objectif : ${goal}</span>
            </div>

            <div className="flex flex-col text-right text-xs">
              <span className="text-lg font-bold">{progress.toFixed(0)}%</span>
              <span>de l&apos;objectif atteint</span>
            </div>
          </div>

          <Progress className="w-full" value={progress} />
        </div>

        <div className="mt-auto flex">
          <Button size={"lg"} className="flex-1 font-semibold" asChild>
            <Link href="https://ko-fi.com/cartoonhub">Faire un don</Link>
          </Button>
        </div>
      </Card>

      <Card className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <MessageCircle className="mb-2 size-7 fill-foreground" />
          <p className="text-xl font-bold">Rejoignez notre Discord</p>
          <p className="text-sm">
            Rejoignez notre Discord pour rester informé et participer à la
            communauté CartoonHub.
          </p>
        </div>

        <div className="mt-auto flex gap-4">
          <Button size={"lg"} className="flex-1 font-semibold" asChild>
            <Link href="https://discord.gg/M7gRTuXc6d">
              Rejoindre la communauté
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DonationCard;
