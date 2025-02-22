"use client";

import { useUser } from "@clerk/clerk-react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LucideIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateDocument } from "@/features/documents/api/use-create-document";
import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { useArchiveDocument } from "@/features/documents/api/use-archive-document";
import { TooltipWrapper } from "@/components/tooltip-wrapper";

interface ItemProps {
  onClick?: () => void;
  label: string;
  icon: LucideIcon;
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  onExpand?: () => void;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
}

const Item = ({
  icon: Icon,
  label,
  onClick,
  active,
  documentIcon,
  onExpand,
  expanded,
  id,
  isSearch,
  level = 0,
}: ItemProps) => {
  const router = useRouter();

  const ChevronIcon = expanded ? ChevronDownIcon : ChevronRightIcon;

  const { user } = useUser();
  const { mutate: createDocument, isPending: isCreatingDocument } =
    useCreateDocument();
  const { isPending: isArchivingDocument, mutate: archiveDocument } =
    useArchiveDocument();

  const handleExpand = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.();
  };

  const onCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    if (!id) {
      return;
    }

    toast.loading("Creating a new note...", { id: "new-note" });

    createDocument(
      { title: "Untitled", parentDocument: id },
      {
        onSuccess: (data) => {
          toast.success("New note created!", { id: "new-note" });

          if (!expanded) {
            onExpand?.();
          }

          router.push(`/documents/${data}`);
        },
        onError: () => {
          toast.error("Failed to create a new note.", { id: "new-note" });
        },
      }
    );
  };

  const onArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    if (!id) {
      return;
    }

    archiveDocument(
      { documentId: id },
      {
        onSuccess: () => {
          toast.success("Note moved to trash!");

          if (!expanded) {
            onExpand?.();
          }

          router.push("/documents");
        },
        onError: () => {
          toast.error("Failed to archive the note.");
        },
      }
    );
  };

  return (
    <button
      onClick={onClick}
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <button
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="!size-4 shrink-0 text-muted-foreground" />
        </button>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <TooltipWrapper
              label="Delete and more..."
              side="bottom"
              align="center"
            >
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                <button
                  disabled={isCreatingDocument || isArchivingDocument}
                  className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <MoreHorizontalIcon className="!size-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
            </TooltipWrapper>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem asChild>
                <button
                  onClick={onArchive}
                  className="w-full hover:text-rose-600"
                >
                  <Trash2Icon />
                  Move to trash
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Last edited by: {user?.fullName}
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipWrapper
            label="Add a page inside"
            side="bottom"
            align="center"
          >
            <button
              onClick={onCreate}
              disabled={isCreatingDocument || isArchivingDocument}
              className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              <PlusIcon className="!size-4 text-muted-foreground" />
            </button>
          </TooltipWrapper>
        </div>
      )}
    </button>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="size-4" />
      <Skeleton className="size-4 w-[30%]" />
    </div>
  );
};

export { Item };
