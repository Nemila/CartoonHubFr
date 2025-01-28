"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { editMediaSchema, EditMediaType } from "@/features/media/schemas/media";
import { editMedia } from "@/features/media/server/actions/media";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Media } from "@prisma/client";
import { useForm } from "react-hook-form";

type Props = { media: Media };
const EditMediaForm = ({ media }: Props) => {
  const { toast } = useToast();

  const form = useForm<EditMediaType>({
    resolver: zodResolver(editMediaSchema),
    defaultValues: {
      tmdbId: media.tmdbId,
      imdbId: media.imdbId || "",
      season: media.season,
      title: media.title,
      originalTitle: media.originalTitle,
      alternativeTitles: media.alternativeTitles || "",
      overview: media.overview,
      releaseDate: media.releaseDate,
      posterPath: media.posterPath || "",
      backdropPath: media.backdropPath || "",
      popularity: media.popularity,
      rating: media.rating,
      id: media.id,
    },
  });

  const onSubmit = async (values: EditMediaType) => {
    const response = await editMedia(values);

    if (!response) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Media has beeen updated",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input required disabled placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input required placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tmdbId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TMDB ID</FormLabel>
              <FormControl>
                <Input
                  required
                  type="number"
                  placeholder="Type here"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="season"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Season</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imdbId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IMDB ID</FormLabel>
              <FormControl>
                <Input placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="originalTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original Title</FormLabel>
              <FormControl>
                <Input placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternativeTitles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternative Titles</FormLabel>
              <FormControl>
                <Input placeholder="Type here" {...field} />
              </FormControl>
              <FormDescription>Separated by a comma</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="posterPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster Path</FormLabel>
              <FormControl>
                <Input type="url" placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backdropPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backdrop Path</FormLabel>
              <FormControl>
                <Input type="url" placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="popularity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Popularite</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Date</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overview"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Overview</FormLabel>
              <FormControl>
                <Textarea placeholder="Type here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default EditMediaForm;
