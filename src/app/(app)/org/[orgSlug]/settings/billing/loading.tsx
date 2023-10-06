import { Separator } from "@/components/ui/separator";
import CardDataModifierLoading from "~/app/(app)/account/_components/card-data-modifier-loading";

const BillingLoading = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Billing</h3>
      <p className="text-sm text-muted-foreground">
        Manage billing and the org subscription plan.
      </p>
    </div>
    <Separator />
    <CardDataModifierLoading className="mt-4" />
  </div>
);

export default BillingLoading;
