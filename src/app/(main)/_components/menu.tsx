"use client";

import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArchiveDocument } from "@/features/documents/api/use-archive-document";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuProps {
  documentId: Id<"documents">;
}

const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const { mutate: archiveDocument } = useArchiveDocument();

  const onArchive = () => {
    toast.loading("Moving to trash...", { id: `archiving-${documentId}` });

    archiveDocument(
      { documentId },
      {
        onSuccess: () => {
          toast.success("Note moved to trash!", {
            id: `archiving-${documentId}`,
          });

          router.push("/documents");
        },
        onError: () => {
          toast.error("Failed to archive the note.", {
            id: `archiving-${documentId}`,
          });
        },
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon className="!size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash2Icon className="!size-4" />
          Move to trash
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Last edited by: {user?.fullName}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="size-10" />
}

export { Menu };
