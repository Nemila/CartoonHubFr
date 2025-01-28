import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-1 flex-col gap-4 py-4">
      <h3 className="text-3xl font-bold">Admin Space</h3>

      <div className="flex flex-wrap gap-4">
        <Link
          prefetch={false}
          href={`/admin/media/import`}
          className="hover:underline"
        >
          Import Media
        </Link>

        <Link
          prefetch={false}
          href={`/admin/media/create`}
          className="hover:underline"
        >
          Upsert Media
        </Link>

        <Link
          prefetch={false}
          href={`/admin/episode/create`}
          className="hover:underline"
        >
          Create Episode
        </Link>

        <Link
          prefetch={false}
          href={`/admin/player/create`}
          className="hover:underline"
        >
          Create Player
        </Link>
      </div>

      {children}
    </div>
  );
};

export default AdminLayout;
