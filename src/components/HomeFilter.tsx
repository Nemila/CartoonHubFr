"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const HomeFilter = () => {
  const [orderBy, setOrderBy] = useQueryState(
    "orderBy",
    parseAsString.withDefault("createdAt"),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  return (
    <header className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
      <div className="flex h-12 w-full max-w-sm overflow-hidden rounded-lg border-2">
        <Button
          variant={"ghost"}
          className={cn(
            "h-12 flex-1 rounded-none",
            orderBy === "popularity" && "text-secondary",
          )}
          onClick={() => setOrderBy("popularity")}
        >
          Populaire
        </Button>

        <div className="h-full w-[2px] bg-border"></div>

        <Button
          variant={"ghost"}
          className={cn(
            "h-12 flex-1 rounded-none",
            orderBy === "createdAt" && "text-secondary",
          )}
          onClick={() => setOrderBy("createdAt")}
        >
          Recent
        </Button>
      </div>

      <div className="flex h-12 self-end overflow-hidden rounded-lg border-2">
        <Button
          size={"icon"}
          variant={"ghost"}
          disabled={page < 2}
          className="size-12 shrink-0 rounded-none"
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft />
        </Button>

        <div className="flex h-12 w-14 shrink-0 items-center justify-center border-x-2 bg-card">
          {page}
        </div>

        <Button
          size={"icon"}
          variant={"ghost"}
          disabled={page > 5}
          className="size-12 shrink-0 rounded-none"
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </header>
  );
};

export default HomeFilter;
