"use client";

import { redirect, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/spinner";
import { useDeleteDocument } from "@/features/documents/api/use-delete-document";
import { useGetTrashContent } from "@/features/documents/api/use-get-trash-content";
import { useRestoreDocument } from "@/features/documents/api/use-restore-document";
import { Id } from "../../../../convex/_generated/dataModel";
import { SearchIcon, Trash2Icon, UndoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { useConfirm } from "@/hooks/use-confirm";

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();

  const { documents, isLoading } = useGetTrashContent();
  const { mutate: restoreDocument } = useRestoreDocument();
  const { mutate: deleteDocument } = useDeleteDocument();

  const [ConfirmationDialog, confirm] = useConfirm({
    message:
      "Are you sure you want to delete this page from Trash? This action is irreversible.",
    title: "Are you sure?",
  });

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) =>
    document.title?.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (documentId: Id<"documents">) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    e.stopPropagation();

    toast.loading("Restoring note...", { id: `restoring-${documentId}` });

    restoreDocument(
      { documentId },
      {
        onSuccess: () => {
          toast.success("Note restored", { id: `restoring-${documentId}` });
        },
        onError: () => {
          toast.error("Failed to restore note", {
            id: `restoring-${documentId}`,
          });
        },
      }
    );
  };

  const onDelete = async (documentId: Id<"documents">) => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    toast.loading("Deleting note...", { id: `deleting-${documentId}` });

    deleteDocument(
      { documentId },
      {
        onSuccess: () => {
          toast.success("Note deleted", { id: `deleting-${documentId}` });
          router.replace("/documents");
        },
        onError: () => {
          toast.error("Failed to delete note", {
            id: `deleting-${documentId}`,
          });
        },
      }
    );

    if (params.documentId === documentId) {
      router.replace("/documents");
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <ConfirmationDialog />
      <div className="text-sm">
        <div className="flex items-center gap-x-1 p-2">
          <SearchIcon className="!size-4" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
            placeholder="Filter by page title"
          />
        </div>
        <div className="mt-2 px-1 pb-1">
          <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
            No documents found.
          </p>
          {filteredDocuments?.map((document) => (
            <button
              onClick={() => onClick(document._id)}
              key={document._id}
              className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
            >
              <span className="truncate pl-2">{document.title}</span>
              <div className="flex items-center">
                <TooltipWrapper label="Restore" side="bottom" align="center">
                  <button
                    onClick={(e) => onRestore(e, document._id)}
                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  >
                    <UndoIcon className="!size-4 text-muted-foreground" />
                  </button>
                </TooltipWrapper>
                <TooltipWrapper
                  label="Delete from trash"
                  side="bottom"
                  align="center"
                >
                  <button
                    onClick={() => onDelete(document._id)}
                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  >
                    <Trash2Icon className="!size-4 text-muted-foreground" />
                  </button>
                </TooltipWrapper>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export { TrashBox };
