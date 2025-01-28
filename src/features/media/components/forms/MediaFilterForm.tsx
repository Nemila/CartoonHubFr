"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  filterMediaSchema,
  FilterMediaType,
} from "@/features/media/schemas/media";
import { changePage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Genre, Network, WatchProvider } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type Props = {
  watchProviders: WatchProvider[];
  networks: Network[];
  genres: Genre[];
};
const MediaFilterForm = ({ watchProviders, networks, genres }: Props) => {
  const router = useRouter();

  const form = useForm<FilterMediaType>({
    resolver: zodResolver(filterMediaSchema),
    defaultValues: {
      watchProviderIds: [],
      mediaType: "any",
      networkIds: [],
      genreIds: [],
    },
  });

  const onSubmit = async (values: FilterMediaType) => {
    router.push(
      changePage({
        watchProviders: values.watchProviderIds.join(","),
        networks: values.networkIds.join(","),
        genres: values.genreIds.join(","),
        mediaType: values.mediaType,
        orderBy: "popularity",
        page: 1,
      }),
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="mediaType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="any">Aucun</SelectItem>
                  <SelectItem value="movies">Films</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="networkIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chaines</FormLabel>
              <FormControl>
                <MultiSelect
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  options={networks.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genreIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genres</FormLabel>
              <FormControl>
                <MultiSelect
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  options={genres.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="watchProviderIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plateformes</FormLabel>
              <FormControl>
                <MultiSelect
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  options={watchProviders.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-1 flex gap-2 md:col-span-2">
          <Button type="submit">Filtrer</Button>
        </div>
      </form>
    </Form>
  );
};

export default MediaFilterForm;
