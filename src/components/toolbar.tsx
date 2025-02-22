"use client";

import { ImageIcon, SmileIcon, XIcon } from "lucide-react";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { useUpdateDocument } from "@/features/documents/api/use-update-document";
import { Doc } from "../../convex/_generated/dataModel";
import { EmojiPopover } from "./emoji-popover";
import { Button } from "./ui/button";
import { useRemoveIcon } from "@/features/documents/api/use-remove-icon";
import { useCoverImageModal } from "@/features/documents/hooks/use-cover-image-modal";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const coverImageModal = useCoverImageModal();

  const [title, setTitle] = useState(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateDocument } = useUpdateDocument();
  const { mutate: removeIcon } = useRemoveIcon();

  const enableInput = () => {
    if (preview) {
      return;
    }

    setTitle(initialData.title as string);
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);

    updateDocument({
      documentId: initialData._id,
      title: e.target.value || "Untitled",
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (emoji: string) => {
    updateDocument({
      documentId: initialData._id,
      icon: emoji,
    });
  };

  const onIconRemove = () => {
    removeIcon({ documentId: initialData._id });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex w-min items-center gap-x-2 group/icon mt-6 relative">
          <EmojiPopover onEmojiSelect={onIconSelect}>
            <p className="text-6xl hover:opacity-65">{initialData.icon}</p>
          </EmojiPopover>
          <Button
            onClick={onIconRemove}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition size-6 text-muted-foreground text-xs absolute -top-2 -right-2"
            variant="outline"
            size="icon"
          >
            <XIcon className="!size-4" />
          </Button>
        </div>
      )}

      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <EmojiPopover onEmojiSelect={onIconSelect} asChild>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <SmileIcon className="!size-4" />
              Add icon
            </Button>
          </EmojiPopover>
        )}

        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImageModal.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon />
            Add cover
          </Button>
        )}
      </div>

      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={title}
          onChange={onChange}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};

export { Toolbar };
