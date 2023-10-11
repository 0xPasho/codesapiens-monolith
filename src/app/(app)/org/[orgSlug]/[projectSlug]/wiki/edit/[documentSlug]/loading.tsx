import { Skeleton } from "@/components/ui/skeleton";

const EditDocumentPageLoading = () => {
  return (
    <div className="flex justify-center">
      <div className="flex max-w-[800px] flex-col">
        <Skeleton className="min-h-[100px] w-full" />
        <Skeleton className="mt-4 min-h-[500px] w-full" />
      </div>
    </div>
  );
};

export default EditDocumentPageLoading;
