import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EditMediaPage = async () => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="items-start">
          <CardTitle>Edit Media</CardTitle>
          <CardDescription>Edit media metadata</CardDescription>
        </CardHeader>

        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default EditMediaPage;
