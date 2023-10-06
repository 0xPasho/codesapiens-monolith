import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NotFoundPage() {
  return (
    <EmptyPlaceholder className="border-none">
      <EmptyPlaceholder.Icon name="page" />
      <EmptyPlaceholder.Title>
        It seems you are lost, my friend.
      </EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        Please go back home, and try keep navigating from there. If you think
        this is a bug, please report it.
      </EmptyPlaceholder.Description>
      <Link href="/">
        <Button>🏠 Go home</Button>
      </Link>
    </EmptyPlaceholder>
  );
}
