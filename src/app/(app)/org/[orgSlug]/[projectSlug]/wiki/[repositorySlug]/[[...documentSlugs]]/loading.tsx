import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "lucide-react";

const Loading = () => {
  return (
    <main className="relative lg:gap-10 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <Button variant="ghost" className="mt-4 px-1" disabled>
          <ArrowLeftIcon /> Go Back to Repositories
        </Button>
        <Skeleton className="min-h-[100px] w-full" />
        <Skeleton className="mt-4 min-h-[500px] w-full" />
        <hr className="my-4 md:my-6" />
      </div>
    </main>
  );
};

export default Loading;
