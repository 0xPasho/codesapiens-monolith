import { Skeleton } from "@/components/ui/skeleton";

const WikiPageLoading = () => {
  return (
    <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <Skeleton className="min-h-[100px] w-full" />
        <Skeleton className="mt-4 min-h-[500px] w-full" />
      </div>
    </main>
  );
};

export default WikiPageLoading;
