import { Button } from "@/components/ui/button";
import useReadmeStore from "../_utils/readme-context";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import socials from "../_utils/socials-list-links";
import { DeleteIcon, PlusIcon } from "lucide-react";

const SocialsEditItemComponent = ({
  canEdit,
  onPressCta,
  item,
}: {
  canEdit: boolean;
  item?: { socialKey: string; username: string };
  onPressCta?: (metadata?: { socialKey: string; username: string }) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="social">Social Media Links</Label>
      <div className="flex space-x-2">
        <Select className="w-1/2" id="social1" disabled={!canEdit}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a social platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {socials.map((social) => (
                <SelectItem value={social.badgeKey}>
                  {social.displayName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          className="w-1/2"
          id="social1username"
          readOnly={!canEdit}
          placeholder="Enter your username"
        />
        <Button
          onClick={() => onPressCta()}
          variant={canEdit ? "outline" : "destructive"}
        >
          {canEdit ? <PlusIcon /> : <DeleteIcon />}
        </Button>
      </div>
    </div>
  );
};

export const SocialsEditComponent = () => {
  const { items, currentlyEditingItemIndex, updateItemData } = useReadmeStore();
  const foundItem = items[currentlyEditingItemIndex];

  return (
    <div className="w-full">
      <SocialsEditItemComponent
        canEdit
        onPressCta={(metadata) => {
          let socialsData = foundItem.data.socials || [];
          socialsData.push(metadata);
          updateItemData({ ...foundItem.data, socials: socialsData });
        }}
      />
      {foundItem.data.socials
        ? foundItem.data.socials.map((socialItem, index) => {
            return (
              <SocialsEditItemComponent
                canEdit={false}
                key={`edit-social-${index}`}
                item={socialItem}
                onPressCta={() => {
                  let socialsData = foundItem.data.socials || [];
                  socialsData.splice(index, 1);
                  updateItemData({ ...foundItem.data, socials: socialsData });
                }}
              />
            );
          })
        : null}
    </div>
  );
};
