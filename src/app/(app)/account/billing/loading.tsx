import { Separator } from "@/components/ui/separator";
import CardDataModifierLoading from "../_components/card-data-modifier-loading";

const BillingLoading = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Billing</h3>
      <p className="text-muted-foreground text-sm">
        Manage billing and your subscription plan.
      </p>
    </div>
    <Separator />
    <CardDataModifierLoading className="mt-4" />
  </div>
);

export default BillingLoading;
