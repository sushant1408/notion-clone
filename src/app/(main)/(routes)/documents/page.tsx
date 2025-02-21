"use client";

import { useUser } from "@clerk/clerk-react";
import { PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useCreateDocument } from "@/features/documents/api/use-create-document";

export default function DocumentsPage() {
  const { user } = useUser();
  const { mutate, isPending } = useCreateDocument();

  const onCreate = () => {
    toast.loading("Creating a new note...", { id: "new-note" });

    mutate(
      { title: "Untitled" },
      {
        onSuccess: () => {
          toast.success("New note created!", { id: "new-note" });
        },
        onError: () => {
          toast.error("Failed to create a new note.", { id: "new-note" });
        },
      }
    );
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        alt="empty"
        height={300}
        width={300}
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        alt="empty"
        height={300}
        width={300}
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Notion Clone
      </h2>
      <Button onClick={onCreate} disabled={isPending}>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <PlusCircleIcon />
            Create a note
          </>
        )}
      </Button>
    </div>
  );
}
