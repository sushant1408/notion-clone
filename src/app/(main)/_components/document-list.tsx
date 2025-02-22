"use client";

import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { useGetSidebarDocuments } from "@/features/documents/api/use-get-sidebar-documents";
import { cn } from "@/lib/utils";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Item } from "./item";

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

const DocumentList = ({ level = 0, parentDocumentId }: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevState) => ({
      ...prevState,
      [documentId]: !prevState[documentId],
    }));
  };

  const { documents, isLoading } = useGetSidebarDocuments({
    parentDocument: parentDocumentId,
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (isLoading) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>
      {documents?.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title || ""}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export { DocumentList };
