"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useRemoveCoverImage } from "@/features/documents/api/use-remove-cover-image";
import { useCoverImageModal } from "@/features/documents/hooks/use-search";
import { cn } from "@/lib/utils";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

const Cover = ({ preview, url }: CoverProps) => {
  const params = useParams<{ documentId: Id<"documents"> }>();

  const [isRepositioning, setIsRepositioning] = useState(false);

  const coverImage = useCoverImageModal();

  const { mutate } = useRemoveCoverImage();

  const onRemove = () => {
    mutate({ documentId: params.documentId });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <Image
          src={url}
          alt="cover"
          fill
          className={cn("object-cover", isRepositioning && "cursor-move")}
        />
      )}
      {isRepositioning && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-1 px-4 bg-black/20 rounded-sm">
          <p className="text-xs text-white">Drag image to reposition</p>
        </div>
      )}
      {url && !preview && !isRepositioning && (
        <div className="opacity-0 group-hover:opacity-100 absolute top-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            Change cover
          </Button>
          <Button
            onClick={() => setIsRepositioning(true)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            Reposition
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            Remove cover
          </Button>
        </div>
      )}
      {url && !preview && isRepositioning && (
        <div className="absolute top-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => {}}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            Save
          </Button>
          <Button
            onClick={() => setIsRepositioning(false)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export { Cover };
