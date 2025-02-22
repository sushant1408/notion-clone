"use client";

import { useRouter } from "next/navigation";

import { useDeleteDocument } from "@/features/documents/api/use-delete-document";
import { useRestoreDocument } from "@/features/documents/api/use-restore-document";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import { Trash2Icon, UndoIcon } from "lucide-react";

interface BannerProps {
  documentId: Id<"documents">;
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const { mutate: deleteDocument } = useDeleteDocument();
  const { mutate: restoreDocument } = useRestoreDocument();

  const [ConfirmationDialog, confirm] = useConfirm({
    message:
      "Are you sure you want to delete this page from Trash? This action is irreversible.",
    title: "Are you sure?",
  });

  const onRestore = () => {
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

  const onDelete = async () => {
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

    router.replace("/documents");
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-3 justify-center">
        <p>This page is in the trash</p>
        <Button
          size="sm"
          onClick={onRestore}
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          <UndoIcon />
          Restore page
        </Button>
        <Button
          size="sm"
          onClick={onDelete}
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          <Trash2Icon />
          Delete from trash
        </Button>
      </div>
    </>
  );
};

export { Banner };
