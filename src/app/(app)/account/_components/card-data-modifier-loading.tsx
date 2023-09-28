import { Skeleton } from "@/components/ui/skeleton";
import CardDataModifier from "./card-data-modifier";

const CardDataModifierLoading = ({ className }: { className?: string }) => (
  <CardDataModifier
    className={className}
    header={<Skeleton className="py-5" />}
    content={<Skeleton className="py-5" />}
    footer={
      <div className={"flex w-full flex-1 justify-end"}>
        <div className="max-w-[80px]">
          <Skeleton className="py-5" />
        </div>
      </div>
    }
  />
);

export default CardDataModifierLoading;
