import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createEpisode } from "@/features/episodes/server/actions/episode";
import MediaService from "@/features/media/server/db/media";
import { checkPlayerExists } from "@/features/players/server/actions/player";
import {
  getMediaGlobalTag,
  getMediaTmdbIdTag,
  getMediaTypeTag,
} from "@/lib/cache";
import { extractMediaData } from "@/lib/utils";
import { getFiles } from "@/server/abyss";
import { revalidateTag } from "next/cache";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const ImportPage = async ({ searchParams }: Props) => {
  const { page } = await searchParams;
  const pageNumber = Math.max(Number(page), 1);
  const fileList = await getFiles(pageNumber);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p>You are on page {page}</p>
        <p>Would you like to import these files?</p>
      </div>

      <div className="ml-auto flex gap-2">
        <Button variant={"secondary"} asChild>
          <Link prefetch={false} href={`?page=${pageNumber - 1}`}>
            Previous
          </Link>
        </Button>

        {fileList && (
          <form
            action={async () => {
              "use server";
              const mediaService = new MediaService();

              for (const file of fileList.items) {
                try {
                  const url = `https://short.ink/${file.slug}`;
                  const playerExists = await checkPlayerExists(url);
                  if (playerExists) throw new Error("Player Exists");
                  const extracted = extractMediaData(file.name);

                  const media = await mediaService.addMedia({
                    mediaType: extracted.mediaType,
                    season: extracted.seasonNumber,
                    tmdbId: extracted.tmdbId,
                  });

                  await createEpisode({
                    episode: extracted.episodeNumber,
                    season: extracted.seasonNumber,
                    mediaType: extracted.mediaType,
                    tmdbId: extracted.tmdbId,
                    videoHost: "hydrax",
                    mediaId: media.id,
                    language: "vf",
                    url,
                  });

                  revalidateTag(getMediaGlobalTag());
                  revalidateTag(getMediaTypeTag(media.mediaType));
                  revalidateTag(
                    getMediaTmdbIdTag(media.mediaType, media.tmdbId),
                  );
                } catch (error) {
                  console.error((error as Error).message, file.name);
                }
              }
            }}
          >
            <SubmitButton />
          </form>
        )}

        <Button variant={"secondary"} asChild>
          <Link prefetch={false} href={`?page=${pageNumber + 1}`}>
            Next
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-md">
        {fileList && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Resolution</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {fileList.items.map((file) => (
                <TableRow key={file.slug}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell className="text-right">
                    {file.resolution}
                  </TableCell>
                  <TableCell className="text-right">{file.size}</TableCell>
                  <TableCell>{file.slug}</TableCell>
                  <TableCell>https://short.ink/{file.slug}</TableCell>
                  <TableCell>{file.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="ml-auto flex gap-2">
        <Button variant={"secondary"} asChild>
          <Link prefetch={false} href={`?page=${pageNumber - 1}`}>
            Previous
          </Link>
        </Button>

        <Button variant={"secondary"} asChild>
          <Link prefetch={false} href={`?page=${pageNumber + 1}`}>
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ImportPage;
