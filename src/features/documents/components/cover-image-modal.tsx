"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEdgeStore } from "@/lib/edgestore";
import { useUpdateDocument } from "../api/use-update-document";
import { useCoverImageModal } from "../hooks/use-search";
import { Id } from "../../../../convex/_generated/dataModel";

const CoverImageModal = () => {
  const params = useParams<{ documentId: Id<"documents"> }>();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { edgestore } = useEdgeStore();
  const { isOpen, onClose } = useCoverImageModal();

  const { mutate: updateDocument } = useUpdateDocument();

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
      });

      updateDocument(
        { documentId: params.documentId, coverImage: res.url },
        {
          onSuccess: () => {
            handleClose();
          },
        }
      );
    }
  };

  const handleClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Cover image
          </DialogTitle>
        </DialogHeader>
        <div>
          <SingleImageDropzone
            value={file}
            onChange={onChange}
            disabled={isSubmitting}
            className="w-full outline-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CoverImageModal };
