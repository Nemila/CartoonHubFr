import { Skeleton } from "./ui/skeleton";

const SkeletonGrid = () => {
  return (
    <div className="cartoon-grid">
      {Array.from({ length: 24 }).map((_, index) => (
        <Skeleton key={index} className="aspect-[3/4.5] w-full" />
      ))}
    </div>
  );
};

export default SkeletonGrid;
