"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BellIcon,
  CardStackIcon,
  ExitIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { HelpCircleIcon } from "lucide-react";

export default function HeaderProfileButton() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={
                sessionData?.user.image ??
                `https://avatar.vercel.sh/${sessionData?.user.name}.png`
              }
            />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/account">
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>
                  <PersonIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            <Link href="/account/billing">
              <DropdownMenuItem>
                Billing<DropdownMenuShortcut>💸</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            {/* <Link href="/account/projects">
            <DropdownMenuItem>
              Projects
              <DropdownMenuShortcut>
                <CardStackIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link> */}
            <Link href="/account/notifications">
              <DropdownMenuItem>
                Notifications
                <DropdownMenuShortcut>
                  <BellIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link href="https://twitter.com/codesapiens_ai">
            <DropdownMenuItem>
              Support
              <DropdownMenuShortcut>
                <HelpCircleIcon className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              signOut().then(() => {
                window.location.href = "/";
              });
            }}
          >
            Log out
            <DropdownMenuShortcut>
              <ExitIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
