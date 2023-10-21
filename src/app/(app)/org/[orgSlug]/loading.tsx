import CardDataModifierLoading from "../../account/_components/card-data-modifier-loading";
import { Skeleton } from "@/components/ui/skeleton";

const OrgProjectsLoading = () => (
  <div className="mt-14  flex w-full justify-center">
    <div className="flex w-[1200px] max-w-full flex-col px-4 sm:px-8 md:px-12 lg:px-12 xl:px-0">
      <div className="flex w-full flex-col sm:flex-row ">
        <div className="flex flex-1 flex-col">
          <Skeleton className="w-full py-8" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardDataModifierLoading
            className="mt-4"
            key={`skeleton-org-item-${i}`}
          />
        ))}
      </div>
    </div>
  </div>
);

export default OrgProjectsLoading;
