"use client";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectOrder = () => {
  const [orderBy, setOrderBy] = useQueryState("orderBy");

  return (
    <Select onValueChange={(value) => setOrderBy(value)}>
      <SelectTrigger className="min-w-[200px]" value={orderBy || ""}>
        <SelectValue placeholder="Trier par" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="popularity_desc">Popularité décroissante</SelectItem>
        <SelectItem value="popularity_asc">Popularité croissante</SelectItem>
        <SelectItem value="rating_asc">Note croissante</SelectItem>
        <SelectItem value="rating_desc">Note décroissante</SelectItem>
        <SelectItem value="createdAt_asc">Date d’ajout croissante</SelectItem>
        <SelectItem value="createdAt_desc">
          Date d’ajout décroissante
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectOrder;
