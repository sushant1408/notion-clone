"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useRemoveCoverImage } from "@/features/documents/api/use-remove-cover-image";
import { useCoverImageModal } from "@/features/documents/hooks/use-cover-image-modal";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

const Cover = ({ preview, url }: CoverProps) => {
  const params = useParams<{ documentId: Id<"documents"> }>();

  const imageRef = useRef<HTMLImageElement>(null);

  const { edgestore } = useEdgeStore();
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [imagePosition, setImagePosition] = useState(0); // 0% = top
  const [tempPosition, setTempPosition] = useState(0);

  const coverImage = useCoverImageModal();

  const { mutate } = useRemoveCoverImage();

  const onRemove = () => {
    if (url) {
      mutate(
        { documentId: params.documentId },
        {
          onSuccess: async () => {
            await edgestore.publicFiles.delete({ url });
          },
        }
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isRepositioning) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStartY(e.clientY);
    // Use current temp position as the base for new drag
    setImagePosition(tempPosition);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !isRepositioning) return;
      e.preventDefault();

      const deltaY = e.clientY - dragStartY;
      // Invert deltaY and convert to percentage for object-position (0-100%)
      const newPosition = Math.max(
        0,
        Math.min(100, imagePosition - deltaY / 4)
      );
      setTempPosition(newPosition);
    },
    [isDragging, isRepositioning, dragStartY, imagePosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSavePosition = () => {
    setImagePosition(tempPosition);
    setIsRepositioning(false);
    setIsDragging(false);
  };

  const handleCancelReposition = () => {
    setTempPosition(imagePosition);
    setIsRepositioning(false);
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group overflow-hidden",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <div
          className={cn(
            "absolute inset-0",
            isRepositioning && "cursor-move select-none"
          )}
          onMouseDown={handleMouseDown}
        >
          <Image
            ref={imageRef}
            src={url}
            alt="cover"
            fill
            className="w-full h-full object-cover transition-[object-position] duration-0"
            style={{
              objectPosition: `center ${
                isRepositioning ? tempPosition : imagePosition
              }%`,
            }}
          />
        </div>
      )}
      {isRepositioning && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-1 px-4 bg-black/20 rounded-sm">
          <p className="text-xs text-white">Drag image to reposition</p>
        </div>
      )}
      {url && !preview && !isRepositioning && (
        <div className="opacity-0 group-hover:opacity-100 absolute top-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            Change cover
          </Button>
          <Button
            onClick={() => {
              setIsRepositioning(true);
              setTempPosition(imagePosition);
            }}
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
            onClick={handleSavePosition}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            Save
          </Button>
          <Button
            onClick={handleCancelReposition}
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

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[35vh]" />;
};

export { Cover };
