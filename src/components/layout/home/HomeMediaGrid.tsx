"use client";
import MediaCard from "@/features/media/components/MediaCard";
import { cn } from "@/lib/utils";
import { media } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";

type Props = {
  data: {
    popularity: media[];
    createdAt: media[];
  };
};

const orderByArray = ["popularity", "createdAt"] as const;

const HomeMediaGrid = ({ data }: Props) => {
  const [orderBy, setOrderBy] = useQueryState(
    "orderBy",
    parseAsStringLiteral(orderByArray).withDefault("popularity"),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div className="flex h-12 w-full max-w-xs overflow-hidden rounded-lg border">
          <button
            className={cn(
              "h-12 flex-1 rounded-none outline-none hover:bg-dark-3 focus-visible:bg-dark-3 focus-visible:text-secondary",
              orderBy === "popularity" && "bg-dark-2 text-secondary",
            )}
            onClick={() => setOrderBy("popularity")}
          >
            Populaire
          </button>

          <div className="h-full w-[1px] bg-border"></div>

          <button
            className={cn(
              "h-12 flex-1 rounded-none outline-none hover:bg-dark-3 focus-visible:bg-dark-3 focus-visible:text-secondary",
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
              "flex h-full w-12 flex-1 shrink-0 items-center justify-center rounded-none outline-none hover:bg-dark-3 focus-visible:bg-dark-3 focus-visible:text-secondary disabled:brightness-50",
            )}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </button>

          <div className="flex h-full w-14 shrink-0 items-center justify-center border-x bg-dark-0">
            {page}
          </div>

          <button
            disabled={page > 5}
            className={cn(
              "flex h-full w-12 flex-1 shrink-0 items-center justify-center rounded-none outline-none hover:bg-dark-3 focus-visible:bg-dark-3 focus-visible:text-secondary disabled:brightness-50",
            )}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </header>

      <div className="cartoon-grid">
        {data[orderBy]
          .slice((page - 1) * 30, (page - 1) * 30 + 30)
          .map((item) => (
            <MediaCard key={item.id} data={item} />
          ))}
      </div>
    </div>
  );
};

export default HomeMediaGrid;
