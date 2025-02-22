"use client";

import { useState } from "react";

import { useOrigin } from "@/hooks/use-origin";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useUpdateDocument } from "@/features/documents/api/use-update-document";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon, GlobeIcon } from "lucide-react";
import { Spinner } from "@/components/spinner";

interface PublishProps {
  initialData: Doc<"documents">;
}

const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();

  const { mutate } = useUpdateDocument();

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);
    toast.loading("Publishing...", { id: `publishing-${initialData._id}` });

    mutate(
      { documentId: initialData._id, isPublished: true },
      {
        onSuccess: () => {
          toast.success("Note published", {
            id: `publishing-${initialData._id}`,
          });
        },
        onError: () => {
          toast.error("Failed to publish the note", {
            id: `publishing-${initialData._id}`,
          });
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const onUnpublish = () => {
    setIsSubmitting(true);
    toast.loading("Unpublishing...", { id: `unpublishing-${initialData._id}` });

    mutate(
      { documentId: initialData._id, isPublished: false },
      {
        onSuccess: () => {
          toast.success("Note unpublished", {
            id: `unpublishing-${initialData._id}`,
          });
        },
        onError: () => {
          toast.error("Failed to unpublish the note", {
            id: `unpublishing-${initialData._id}`,
          });
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const onCopy = () => {
    setCopied(true);

    navigator.clipboard.writeText(url).then(() => {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <GlobeIcon className="text-sky-500 !size-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <GlobeIcon className="!size-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                value={url}
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <CheckIcon className="!size-4" />
                ) : (
                  <CopyIcon className="!size-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              {isSubmitting ? <Spinner /> : "Unpublish"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <GlobeIcon className="!size-8 text-muted-foreground mb-2" />
            <p className="text-sm mb-2 font-medium">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              {isSubmitting ? <Spinner /> : "Publish"}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export { Publish };
