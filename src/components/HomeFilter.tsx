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
      <div className="flex h-12 w-full max-w-xs overflow-hidden rounded-lg border">
        <button
          className={cn(
            "hover:bg-dark-3 focus-visible:bg-dark-3 h-12 flex-1 rounded-none outline-none focus-visible:text-secondary",
            orderBy === "popularity" && "bg-dark-2 text-secondary",
          )}
          onClick={() => setOrderBy("popularity")}
        >
          Populaire
        </button>

        <div className="h-full w-[1px] bg-border"></div>

        <button
          className={cn(
            "hover:bg-dark-3 focus-visible:bg-dark-3 h-12 flex-1 rounded-none outline-none focus-visible:text-secondary",
            orderBy === "createdAt" && "bg-dark-2 text-secondary",
          )}
          onClick={() => setOrderBy("createdAt")}
        >
          Recent
        </button>
      </div>

      <div className="flex h-12 overflow-hidden rounded-lg border">
        <button
          disabled={page < 2}
          className={cn(
            "hover:bg-dark-3 focus-visible:bg-dark-3 flex h-full w-12 flex-1 shrink-0 items-center justify-center rounded-none outline-none focus-visible:text-secondary disabled:brightness-50",
          )}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft />
        </button>

        <div className="bg-dark-0 flex h-full w-14 shrink-0 items-center justify-center border-x">
          {page}
        </div>

        <button
          disabled={page > 5}
          className={cn(
            "hover:bg-dark-3 focus-visible:bg-dark-3 flex h-full w-12 flex-1 shrink-0 items-center justify-center rounded-none outline-none focus-visible:text-secondary disabled:brightness-50",
          )}
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight />
        </button>
      </div>
    </header>
  );
};

export default HomeFilter;
