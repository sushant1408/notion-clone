"use client";

import { SignOutButton, useUser } from "@clerk/clerk-react";
import { ChevronsLeftRightIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserItem = () => {
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
        >
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="size-5">
              <AvatarFallback>
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className="text-start font-medium truncate">
              {user?.fullName}&apos;s Notion Clone
            </span>
          </div>
          <ChevronsLeftRightIcon className="rotate-90 mr-2 text-muted-foreground !size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <DropdownMenuLabel>
          <div className="flex flex-col gap-y-2">
            <p className="text-xs font-medium text-muted-foreground leading-none truncate">
              {user?.emailAddresses?.[0]?.emailAddress}
            </p>
            <div className="flex items-center gap-x-2">
              <Avatar className="size-8">
                <AvatarFallback>
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
              <p className="text-sm truncate">
                {user?.fullName}&apos;s Notion Clone
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <SignOutButton>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserItem };
