import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getGenresCached } from "@/features/genres/server/actions/genre";
import FilterForm from "@/features/media/components/forms/MediaFilterForm";
import MediaCard from "@/features/media/components/MediaCard";
import { getPaginatedMediaCached } from "@/features/media/server/actions/media";
import { getNetworksCached } from "@/features/networks/server/actions/network";
import { getWatchProvidersCached } from "@/features/watchProviders/server/actions/watchProvider";
import { changePage, changePageSchema, cn } from "@/lib/utils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = { searchParams: Promise<{ page?: string; orderBy?: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

const MediaPage = async ({ searchParams }: Props) => {
  const valid = changePageSchema.safeParse(await searchParams);
  if (!valid.success) return redirect(changePage());
  const params = valid.data;

  const data = await getPaginatedMediaCached({
    watchProviderIds: params.watchProviders,
    networkIds: params.networks,
    orderBy: params.orderBy,
    genreIds: params.genres,
    mediaType: params.mediaType,
    page: params.page,
  });
  if (!data) return notFound();

  const [networks, genres, watchProviders] = await Promise.all([
    getNetworksCached(),
    getGenresCached(),
    getWatchProvidersCached(),
  ]);

  return (
    <main className="flex flex-col gap-4 py-4">
      <FilterForm
        watchProviders={watchProviders}
        networks={networks}
        genres={genres}
      />

      <div className="flex flex-1 flex-col gap-2">
        <p className="text-4xl font-bold">Catalogue</p>
        <div className="flex items-center gap-4 text-sm md:text-base">
          <Link
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
        {data.map((item) => (
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

          {data.length >= 24 && (
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
