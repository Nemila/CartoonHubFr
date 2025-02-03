"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useState } from "react";

const DonationCard = () => {
  const [goal] = useState(200);
  const [totalContributions] = useState(1);
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
            <Link
              target="_blank"
              href="https://www.paypal.com/paypalme/cartoonhub
"
            >
              Faire un don
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DonationCard;
