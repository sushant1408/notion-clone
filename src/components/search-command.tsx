"use client";

import { useUser } from "@clerk/clerk-react";
import { FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useSearch } from "@/features/search/hooks/use-search";
import { useGetSearchDocuments } from "@/features/documents/api/use-get-search-documents";
import { DialogTitle } from "./ui/dialog";
import { Id } from "../../convex/_generated/dataModel";

const SearchCommand = () => {
  const router = useRouter();
  const { user } = useUser();

  const { documents } = useGetSearchDocuments();

  const { isOpen, onClose, onOpen, toggle } = useSearch();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);

    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [toggle]);

  if (!isMounted) {
    return null;
  }

  const onSelect = (documentId: Id<"documents">) => {
    router.push(`/documents/${documentId}`);
    onClose();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="hidden"></DialogTitle>
      <CommandInput
        placeholder={`Search ${user?.fullName}'s Notion Clone...`}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document._id)}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <FileIcon className="mr-2 !size-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export { SearchCommand };
