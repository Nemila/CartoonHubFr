import MobileNavbar from "@/components/layout/mobile-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="sticky left-0 top-0 z-10 flex w-full items-center justify-center border-b bg-card">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link prefetch={false} href={"/"}>
          <Image
            priority
            alt="logo"
            width={100}
            height={43}
            title="logo"
            className="h-[43px] w-[100px]"
            src={"/logo-light.svg"}
            unoptimized
          />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-4 lg:flex">
          <form action="/search" className="flex-1">
            <Input
              placeholder="Rechercher des films et des séries..."
              className="w-full min-w-[300px] border-none"
              name="query"
              required
            />
          </form>

          <div className="flex shrink-0 gap-2">
            <Button variant={"ghost"} asChild>
              <Link prefetch={false} href={"/"}>
                Accueil
              </Link>
            </Button>

            <Button variant={"ghost"} asChild>
              <Link prefetch={false} href={"/catalogue"}>
                Catalogue
              </Link>
            </Button>

            <Button variant={"ghost"} asChild>
              <Link prefetch={false} href={"https://discord.gg/M7gRTuXc6d"}>
                Communauté
              </Link>
            </Button>

            <SignedOut>
              <Button asChild variant={"ghost"}>
                <SignInButton>Connexion</SignInButton>
              </Button>
            </SignedOut>

            <SignedIn>
              <Button asChild variant={"ghost"}>
                <SignOutButton>Se Deconnecter</SignOutButton>
              </Button>
            </SignedIn>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="flex gap-2 lg:hidden">
          <Button asChild variant={"ghost"} size={"icon"}>
            <Link prefetch={false} href="/search">
              <Search className="size-6" />
            </Link>
          </Button>

          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
