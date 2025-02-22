"use client";

import { use } from "react";

import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import { useGetDocumentById } from "@/features/documents/api/use-get-document-by-id";
import { Toolbar } from "@/components/toolbar";

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const { documentId } = use(params);

  const { document, isLoading } = useGetDocumentById({ documentId });

  if (isLoading) {
    return null;
  }

  if (document === null) {
    return <div className="">Document not found.</div>;
  }

  return (
    <div className="pb-40">
      <div className="h-[35vh]" />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document as Doc<"documents">} />
      </div>
    </div>
  );
}
