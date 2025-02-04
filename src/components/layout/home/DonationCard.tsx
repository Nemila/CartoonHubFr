import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const DonationCard = () => {
  return (
    <Card className="flex flex-1 flex-col gap-4 p-4">
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
            <span className="text-lg font-bold">$200</span>
            <span>Objectif : $10</span>
          </div>

          <div className="flex flex-col text-right text-xs">
            <span className="text-lg font-bold">10%</span>
            <span>de l&apos;objectif atteint</span>
          </div>
        </div>

        <Progress className="w-full" value={10} />
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
  );
};

export default DonationCard;
