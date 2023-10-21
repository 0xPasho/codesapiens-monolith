import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function PlanCard({
  plan,
  currentPlan,
  hasAuth,
  onManagePlan,
  onUpgrade,
  onDowngrade,
  onGetStarted,
  onChoosePlan,
}: {
  plan: any;
  currentPlan?: string;
  hasAuth: boolean;
  onManagePlan?: (plan: any) => void;
  onUpgrade?: (plan: any) => void;
  onDowngrade?: (plan: any) => void;
  onGetStarted?: (plan: any) => void;
  onChoosePlan?: (plan: any) => void;
}) {
  const getButtonLabel = () => {
    if (!hasAuth && plan.key === "free")
      return { title: "Get started", onClick: onGetStarted };
    if (currentPlan === plan.title?.toLowerCase())
      return { title: "Manage current plan", onClick: onManagePlan };
    if (
      (plan.key === "free" && ["max", "pro"].includes(currentPlan)) ||
      (plan.key === "pro" && currentPlan === "max")
    )
      return { title: "Downgrade", onClick: onDowngrade };
    if (plan.key === "max" && currentPlan === "pro")
      return { title: "Upgrade", onClick: onUpgrade };
    return { title: "Choose Plan", onClick: onChoosePlan };
  };

  const isGradientRequired = () => {
    const isNotLoggedInAndPlanIsTheMostPopular =
      !hasAuth && !currentPlan && plan.isTheMostPopular;
    const loggedUserHasFreePlan = hasAuth && currentPlan === "free";
    return (
      isNotLoggedInAndPlanIsTheMostPopular ||
      (loggedUserHasFreePlan && plan.isTheMostPopular)
    );
  };

  const { title, onClick } = getButtonLabel();
  return (
    <div
      className={cn(
        "mb-10 w-full rounded-lg p-6 transition duration-100 ease-in-out md:mb-0 md:mr-4 md:w-1/3",
        {
          "border-2 border-yellow-400 bg-gradient-to-b from-transparent to-yellow-300 text-black shadow-lg hover:shadow-xl dark:from-black dark:to-yellow-900 dark:text-white":
            isGradientRequired(),
          "border border-gray-200 bg-transparent text-black dark:text-white":
            !isGradientRequired(),
        },
      )}
    >
      {plan.isTheMostPopular && plan.titl && (
        <Badge className=" bg-yellow-400">Most Popular</Badge>
      )}
      <h3 className="mb-1 text-lg font-semibold">{plan.title}</h3>
      {currentPlan === plan.title?.toLowerCase() && (
        <Badge className=" bg-green-400">Current Plan</Badge>
      )}
      <p className="mt-1">
        <span className="text-6xl font-bold">{plan.price}</span>{" "}
        {plan.title !== "Free" ? "/Month" : "Forever"}
      </p>
      <p className="mt-2 text-sm opacity-80">
        For most businesses that want to optimize web queries.
      </p>
      <div className="mt-4 text-sm">
        {plan.features.map((feature, fIndex) => (
          <p key={fIndex} className="my-2">
            <span className="fa fa-check-circle ml-1 mr-2"></span>
            {feature}
          </p>
        ))}
      </div>
      <button
        className={cn(
          "mt-4 w-full rounded py-4 transition duration-150 ease-in-out",
          {
            "border border-yellow-500 bg-transparent font-bold text-black hover:bg-yellow-400 dark:text-white dark:hover:bg-yellow-800":
              isGradientRequired(),
            "border border-black bg-transparent text-black hover:bg-gray-300":
              !isGradientRequired(),
          },
        )}
        onClick={() => onClick(plan)}
      >
        {title}
      </button>
    </div>
  );
}
