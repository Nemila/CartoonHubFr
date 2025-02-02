"use client";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genre } from "@prisma/client";

type Props = { genres: genre[] };

const GenreFilter = ({ genres }: Props) => {
  const [genre, setGenre] = useQueryState("genre");

  return (
    <Select onValueChange={(value) => setGenre(value)}>
      <SelectTrigger className="min-w-[200px]" value={genre || ""}>
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
  );
};

export default GenreFilter;
