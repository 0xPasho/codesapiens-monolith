import { Skeleton } from "@/components/ui/skeleton";
import NewProjectBase from "./../_components/new-project-base";

const Loading = () => {
  return (
    <NewProjectBase
      step={1}
      title="🤠 Almost there..."
      description="Let's configure your project"
    >
      <Skeleton className="h-48" />
    </NewProjectBase>
  );
};

export default Loading;
