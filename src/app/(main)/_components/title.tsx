import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateDocument } from "@/features/documents/api/use-create-document copy";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
  initialData: Doc<"documents"> | undefined;
}

const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string | undefined>(
    initialData?.title || "Untitled"
  );
  const [isEditing, setIsEditing] = useState(false);

  const { mutate, isPending } = useUpdateDocument();

  const enableInput = () => {
    setTitle(initialData?.title);
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    mutate({ documentId: initialData!._id, title: e.target.value || "Untitled" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData?.icon && <p>{initialData.icon}</p>}

      {isEditing ? (
        <Input
          ref={inputRef}
          value={title}
          onClick={enableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={disableInput}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-6 w-20 rounded-md" />
}

export { Title };
