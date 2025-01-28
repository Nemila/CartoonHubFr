import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMediaCountCached } from "@/features/media/server/actions/media";
import { clearFullCache } from "@/lib/cache";
import { Cat, Clapperboard } from "lucide-react";

const AdminPage = async () => {
  const [movieCount, serieCount] = await Promise.all([
    getMediaCountCached("movies"),
    getMediaCountCached("series"),
  ]);

  return (
    <main className="flex flex-col gap-4">
      <form
        action={async () => {
          "use server";
          clearFullCache();
        }}
      >
        <Button>Clear Cache</Button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <Clapperboard />
              {movieCount || 0}
            </CardTitle>
            <CardDescription>Films</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <Cat />
              {serieCount || 0}
            </CardTitle>
            <CardDescription>Cartoons</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
};

export default AdminPage;
