import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "lucide-react";

const DocumentLoading = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <main className="relative lg:gap-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <Skeleton className="min-h-[100px] w-full" />
          <Skeleton className="mt-4 min-h-[500px] w-full" />
          <hr className="my-4 md:my-6" />
        </div>
      </main>
    </div>
  );
};

export default DocumentLoading;
