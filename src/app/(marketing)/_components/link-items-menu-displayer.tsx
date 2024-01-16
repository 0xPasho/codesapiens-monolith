import { Button } from "@/components/ui/button";

import Link from "next/link";
import {
  BadgeHelpIcon,
  CalendarCheck2Icon,
  Globe2Icon,
  LayersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LinkItemsMenuDisplayer = ({ mobile }: { mobile: boolean }) => {
  const menuItemsData = [
    {
      title: "Explore",
      href: "#try",
      icon: Globe2Icon,
    },
    {
      title: "Pricing",
      href: "/pricing",
      icon: LayersIcon,
    },
    {
      title: "Support",
      href: "https://twitter.com/codesapiens.ai",
      icon: BadgeHelpIcon,
    },
    {
      title: "Schedule a Demo",
      href: "https://calendly.com/codesapiens/30min",
      icon: CalendarCheck2Icon,
    },
  ];

  if (mobile) {
    return (
      <>
        {menuItemsData.map((item, index) => (
          <Link
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium",
            )}
            key={index}
            href={item.href.replace("[orgSlug]", "")}
          >
            <Button className="text-md mx-4 p-1 dark:text-white" variant="link">
              <item.icon className="mr-1.5 h-4 w-4" /> {item.title}
            </Button>
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      {menuItemsData.map((item) => (
        <Link href={item.href}>
          <Button
            className="text-md mx-4 hidden p-1 dark:text-white md:flex"
            variant="link"
          >
            <item.icon className="mr-1.5 h-4 w-4" /> {item.title}
          </Button>
        </Link>
      ))}
    </>
  );
};
export default LinkItemsMenuDisplayer;
