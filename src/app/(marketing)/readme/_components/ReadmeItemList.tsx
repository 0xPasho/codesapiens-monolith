import { Button } from "@/components/ui/button";
import useReadmeStore, { ReadmeItemType } from "../_utils/readme-context";
import {
  KeyIcon,
  LineChartIcon,
  UserCogIcon,
  UsersIcon,
  ViewIcon,
} from "lucide-react";

const useReadmeToolsList = (): Array<{
  type: ReadmeItemType;
  content: React.ReactNode;
  icon: React.ReactNode;
}> => {
  return [
    {
      type: "general",
      content: "Edit General Info",
      icon: <UserCogIcon />,
    },
    {
      type: "github-stats-card",
      content: "Github Stats Card",
      icon: <LineChartIcon />,
    },
    {
      type: "key-info-as-code",
      content: "Your Dev Information",
      icon: <KeyIcon />,
    },
    {
      type: "profile-view-counter",
      content: "Your profile view count",
      icon: <ViewIcon />,
    },
    { type: "your-socials", content: "Edit your socials", icon: <UsersIcon /> },
  ];
};

const ReadmeItemList = () => {
  const list = useReadmeToolsList();
  const { setCurrentlyEditingItemIndex, items, addItem } = useReadmeStore();
  return (
    <div className="w-full gap-2 overflow-x-auto">
      {list.map((listItem) => (
        <Button
          variant="ghost"
          className="p-0.5"
          onClick={() => {
            if (listItem.type === "general") {
              setCurrentlyEditingItemIndex(0);
              return;
            }
            if (listItem.type === "your-socials") {
              setCurrentlyEditingItemIndex(1);
              return;
            }

            const newIndex = items.length;
            addItem({
              type: listItem.type,
              data: {
                theme: "dark",
              },
              position: newIndex,
            });
            setCurrentlyEditingItemIndex(newIndex);
          }}
        >
          {listItem.icon} {listItem.content}
        </Button>
      ))}
    </div>
  );
};

export { ReadmeItemList };
