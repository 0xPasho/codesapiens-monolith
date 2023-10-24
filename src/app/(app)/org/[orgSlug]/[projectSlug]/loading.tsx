import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const Loading = () => {
  return (
    <main className="relative items-center">
      <div className="mx-auto w-[800px] min-w-0 max-w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="mt-4">
            <div className={"flex flex-row px-2"}>
              <div>
                <Skeleton className="h-full w-16" />
              </div>
              <div className="ml-4 flex-1 flex-1">
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Loading;
