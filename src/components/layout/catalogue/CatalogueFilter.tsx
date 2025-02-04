"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { catalogueSearchParams } from "@/lib/searchParams";
import { genre, network } from "@prisma/client";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { genres: genre[]; networks: network[] };

const CatalogueFilter = ({ genres, networks }: Props) => {
  const [orderBy, setOrderBy] = useState<"popularity" | "rating">("popularity");
  const [network, setNetwork] = useState<string | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [, setFilters] = useQueryStates(catalogueSearchParams);

  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Select
          onValueChange={(value) => {
            setOrderBy(value as "popularity" | "rating");
          }}
        >
          <SelectTrigger value={orderBy} className="min-w-[150px] flex-1">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularité</SelectItem>
            <SelectItem value="rating">Note</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            if (value === "any") setGenre(null);
            else setGenre(value);
          }}
        >
          <SelectTrigger
            value={genre || "any"}
            className="min-w-[150px] flex-1"
          >
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Tout</SelectItem>
            {genres.map((item) => (
              <SelectItem key={item.id} value={item.slug}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            if (value === "any") setNetwork(null);
            else setNetwork(value);
          }}
        >
          <SelectTrigger
            value={network || "any"}
            className="min-w-[150px] flex-1"
          >
            <SelectValue placeholder="Network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Tout</SelectItem>
            {networks.map((item) => (
              <SelectItem key={item.id} value={item.slug}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={() => {
          setFilters({
            genre,
            network,
            orderBy,
          });
        }}
      >
        Filtrer
      </Button>
    </div>
  );
};

export default CatalogueFilter;
