import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="w-full">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton
          className="mt-4 w-full py-11"
          key={`project-loading-index-${index}`}
        />
      ))}
    </div>
  );
}
