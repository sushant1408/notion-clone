"use client";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  LucideIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCreateDocument } from "@/features/documents/api/use-create-document";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ItemProps {
  onClick: () => void;
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

  const { mutate, isPending } = useCreateDocument();

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

    mutate(
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
          <button className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
            <MoreHorizontalIcon className="!size-4 text-muted-foreground" />
          </button>
          <button
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <PlusIcon className="!size-4 text-muted-foreground" />
          </button>
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
