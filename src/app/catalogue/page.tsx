import GenreFilter from "@/components/GenreFilter";
import MediaTypeFilter from "@/components/MediaTypeFilter";
import NetworkFilter from "@/components/NetworkFilter";
import SelectOrder from "@/components/SelectOrder";
import prisma from "@/lib/prisma";

const MediaPage = async () => {
  const [genres, networks] = await Promise.all([
    prisma.genre.findMany(),
    prisma.network.findMany(),
  ]);

  return (
    <main className="flex flex-col gap-4 py-4">
      <div className="flex flex-1 items-center justify-between gap-2">
        <p className="text-4xl font-bold">Catalogue</p>

        <div className="flex gap-4">
          <SelectOrder />
          <MediaTypeFilter />
          <GenreFilter genres={genres} />
          <NetworkFilter networks={networks} />
        </div>
      </div>
    </main>
  );
};

export default MediaPage;
