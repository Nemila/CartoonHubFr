import { Input } from "@/components/ui/input";
import MediaCard from "@/features/media/components/MediaCard";
import { searchMedia } from "@/actions/media";

type Props = { searchParams: Promise<{ query?: string }> };

const SearchPage = async ({ searchParams }: Props) => {
  const { query } = await searchParams;
  const data = await searchMedia(query);

  return (
    <main className="flex flex-col gap-4 py-4">
      <form action="#">
        <Input
          placeholder="Rechercher des films et des séries..."
          autoComplete={"off"}
          type="text"
          defaultValue={query}
          minLength={1}
          name="query"
          required
          min={1}
        />
      </form>

      {data && data.length > 0 ? (
        <div className="cartoon-grid">
          {data.map((item, index) => (
            <MediaCard key={`${item.id}-${index}`} data={item} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-2xl font-bold">Aucun Resultats</p>
      )}
    </main>
  );
};

export default SearchPage;
