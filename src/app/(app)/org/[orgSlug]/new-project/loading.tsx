import { Skeleton } from "@/components/ui/skeleton";
import NewProjectBase from "./_components/new-project-base";

const Loading = () => {
  return (
    <NewProjectBase
      step={0}
      title="✨ Let's create magic!"
      description="Bring up your Git repo to start"
    >
      <div className="flex flex-col gap-6 rounded-[4px] ">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </NewProjectBase>
  );
};

export default Loading;
