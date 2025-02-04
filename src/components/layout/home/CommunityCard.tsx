import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  SiDiscord,
  SiInstagram,
  SiReddit,
  SiTelegram,
  SiTiktok,
} from "react-icons/si";

const CommunityCard = () => {
  return (
    <Card className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <MessageCircle className="mb-2 size-7 fill-foreground" />
        <p className="text-xl font-bold">Communauté CartoonHub</p>
        <p className="text-sm">
          Suivez-nous sur nos réseaux sociaux pour ne rien manquer ! Rejoignez
          la communauté CartoonHub, échangez avec d&apos;autres fans et restez à
          jour sur toutes nos nouveautés.
        </p>
      </div>

      <div className="flex gap-2">
        <Button size={"icon"}>
          <Link target="_blank" href="https://discord.com/invite/2Cj7ATwvQT">
            <SiDiscord />
          </Link>
        </Button>

        <Button size={"icon"}>
          <Link target="_blank" href="https://discord.com/invite/2Cj7ATwvQT">
            <SiInstagram />
          </Link>
        </Button>

        <Button size={"icon"}>
          <Link target="_blank" href="https://discord.com/invite/2Cj7ATwvQT">
            <SiTelegram />
          </Link>
        </Button>

        <Button size={"icon"}>
          <Link target="_blank" href="https://discord.com/invite/2Cj7ATwvQT">
            <SiReddit />
          </Link>
        </Button>

        <Button size={"icon"}>
          <Link target="_blank" href="https://discord.com/invite/2Cj7ATwvQT">
            <SiTiktok />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default CommunityCard;
