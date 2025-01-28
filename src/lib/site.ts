import { Clapperboard, House, MessageCircle, Shield } from "lucide-react";

export const navLinks = [
  {
    staffOnly: false,
    userOnly: false,
    label: "Accueil",
    href: "/",
    icon: House,
  },
  {
    staffOnly: false,
    userOnly: false,
    label: "Catalogue",
    href: "/catalogue",
    icon: Clapperboard,
  },
  {
    staffOnly: false,
    userOnly: false,
    label: "Communauté",
    href: "https://discord.gg/M7gRTuXc6d",
    icon: MessageCircle,
  },
  {
    staffOnly: true,
    userOnly: true,
    label: "Admin",
    href: "/admin",
    icon: Shield,
  },
];
