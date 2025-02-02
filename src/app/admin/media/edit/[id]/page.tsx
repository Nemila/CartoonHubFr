import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditMediaForm from "@/features/media/components/forms/EditMediaForm";
import { findMediaByIdCached } from "@/actions/media";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

const EditMediaPage = async ({ params }: Props) => {
  const { id } = await params;
  const media = await findMediaByIdCached(id);
  if (!media) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="items-start">
          <CardTitle>Edit Media</CardTitle>
          <CardDescription>Edit media metadata</CardDescription>
        </CardHeader>

        <CardContent>
          <EditMediaForm media={media} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMediaPage;
