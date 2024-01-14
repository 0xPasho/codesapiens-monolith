import { toast } from "@/components/ui/use-toast";
import { StripeSuccessUrlType } from "@/lib/utils";

const fireErrorMessage = (type?: string) => {
  switch (type) {
    case "UNAUTHORIZED":
      return {
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
      };
    case "RETRIEVE_SUBSCRIPTION_PLAN":
      return {
        title: "There was an error retreiving your plan.",
        description:
          "Please refresh the page and try again. If this issue persist please contact support.",
      };
    case "MISSING_PLAN":
      return {
        title: "Seems like there wasn't a plan selected",
        description:
          "Please refresh the page and try again. If this issue persist please contact support.",
      };
    case "CREATE_CHECKOUT_SESSION":
      return {
        title: "There was an error creating a checkout for your plan.",
        description:
          "Please refresh the page and try again If this issue persist please contact support..",
      };
    case "BILLING_URL":
      return {
        title: "There was an error getting the billing url for your plan",
        description:
          "Please refresh the page and try again. If this issue persist please contact support.",
      };

    default:
      return {
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
      };
  }
};
async function redirectToStripe({
  orgSlug,
  from,
  callIntent = "buy_or_manage",
}: {
  orgSlug: string;
  from: StripeSuccessUrlType;
  callIntent?: "upgrade" | "buy_or_manage";
}) {
  try {
    // If there's a target plan it will be used to create a checkout session.
    // Otherwise, it will be used to create a portal session.
    let params = `?from=${from}&callIntent=${callIntent}`;
    if (orgSlug) {
      params += "&orgSlug=" + orgSlug;
    }
    const response = await fetch(`/api/stripe${params}`);

    if (!response?.ok) {
      const errorMessages = fireErrorMessage(response.statusText);

      toast({
        ...errorMessages,
        variant: "destructive",
      });
      return;
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage existing subscription.
    const session = await response.json();
    if (session) {
      window.location.href = session.url;
    }
  } catch (e) {
    const errorMessages = fireErrorMessage();
    return toast({
      ...errorMessages,
      variant: "destructive",
    });
  }
}

export { redirectToStripe };
