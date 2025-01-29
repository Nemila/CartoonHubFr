import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import FilterForm from "@/features/media/components/forms/MediaFilterForm";
import MediaCard from "@/features/media/components/MediaCard";
import { getCatalogue } from "@/features/media/server/actions/media";
import { changePage, changePageSchema, cn } from "@/lib/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = { searchParams: Promise<{ page?: string; orderBy?: string }> };

const MediaPage = async ({ searchParams }: Props) => {
  const valid = changePageSchema.safeParse(await searchParams);
  if (!valid.success) redirect(changePage());
  const params = valid.data;

  const data = await getCatalogue({
    watchProviders: params.watchProviders,
    networks: params.networks,
    orderBy: params.orderBy,
    genres: params.genres,
    mediaType: params.mediaType,
    page: params.page,
  });
  if (!data) return notFound();

  return (
    <main className="flex flex-col gap-4 py-4">
      <FilterForm
        watchProviders={data.watchProviders}
        networks={data.networks}
        genres={data.genres}
      />

      <div className="flex flex-1 flex-col gap-2">
        <p className="text-4xl font-bold">Catalogue</p>
        <div className="flex items-center gap-4 text-sm md:text-base">
          <Link
            prefetch={false}
            href={changePage({
              ...params,
              orderBy: "popularity",
            })}
            className={cn(
              params.orderBy === "popularity" && "text-primary underline",
            )}
          >
            Populaires
          </Link>
          <Link
            prefetch={false}
            href={changePage({
              ...params,
              orderBy: "rating",
            })}
            className={cn(
              params.orderBy === "rating" && "text-primary underline",
            )}
          >
            Mieux Notes
          </Link>
          <Link
            prefetch={false}
            href={changePage({
              ...params,
              orderBy: "latest",
            })}
            className={cn(
              params.orderBy === "latest" && "text-primary underline",
            )}
          >
            Derniers Ajouts
          </Link>
        </div>
      </div>

      <div className="cartoon-grid">
        {data.results.map((item) => (
          <MediaCard key={item.id} data={item} />
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          {params.page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={changePage({
                  ...params,
                  page: params.page - 1,
                })}
              />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink>{params.page}</PaginationLink>
          </PaginationItem>

          {data.results.length >= 24 && (
            <PaginationItem>
              <PaginationNext
                href={changePage({
                  ...params,
                  page: params.page + 1,
                })}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default MediaPage;
