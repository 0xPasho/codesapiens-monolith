import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEditReadmeContent } from "../_hooks/useEditReadmeContent";

export function ReadmeItemEditModal({
  onOpenChange,
}: {
  onOpenChange: (newOpenValue: boolean) => void;
}) {
  const { title, component } = useEditReadmeContent();

  return (
    <AlertDialog defaultOpen onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogContent>{component}</AlertDialogContent>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
