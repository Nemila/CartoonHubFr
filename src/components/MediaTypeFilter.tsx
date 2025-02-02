"use client";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MediaTypeFilter = () => {
  const [mediaType, setMediaType] = useQueryState("mediaType");

  return (
    <Select onValueChange={(value) => setMediaType(value)}>
      <SelectTrigger className="min-w-[200px]" value={mediaType || ""}>
        <SelectValue placeholder="Format" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="any">Tout</SelectItem>
        <SelectItem value="movies">Series</SelectItem>
        <SelectItem value="series">Films</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default MediaTypeFilter;
