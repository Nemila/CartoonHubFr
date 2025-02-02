"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { network } from "@prisma/client";
import { useQueryState } from "nuqs";

type Props = { networks: network[] };

const NetworkFilter = ({ networks }: Props) => {
  const [network, setNetwork] = useQueryState("network");

  return (
    <Select onValueChange={(value) => setNetwork(value)}>
      <SelectTrigger className="min-w-[200px]" value={network || ""}>
        <SelectValue placeholder="Network" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="any">Tout</SelectItem>

        {networks.map((item) => (
          <SelectItem key={item.id} value={item.slug}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default NetworkFilter;
