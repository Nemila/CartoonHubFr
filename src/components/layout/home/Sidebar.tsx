import { media } from "@prisma/client";
import AsideCardContainer from "./AsideCardContainer";
import CommunityCard from "./CommunityCard";
import DonationCard from "./DonationCard";

type Props = {
  series: media[];
  movies: media[];
};

const sectionClass =
  "flex w-full flex-col gap-4 md:flex-row lg:max-w-sm lg:flex-col";

const Sidebar = ({ series, movies }: Props) => {
  return (
    <aside className="flex w-full flex-col gap-4 lg:max-w-sm">
      <div className={sectionClass}>
        <CommunityCard />
        <DonationCard />
      </div>

      <div className={sectionClass}>
        <AsideCardContainer
          media={series}
          title={`Top Séries ${new Date().getFullYear() - 1}`}
        />
        <AsideCardContainer
          media={movies}
          title={`Top Films ${new Date().getFullYear() - 1}`}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
