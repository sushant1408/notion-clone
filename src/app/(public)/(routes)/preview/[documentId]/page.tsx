"use client";

import dynamic from "next/dynamic";
import { use, useMemo } from "react";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDocumentById } from "@/features/documents/api/use-get-document-by-id";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

interface PreviewDocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

export default function PreviewDocumentIdPage({
  params,
}: PreviewDocumentIdPageProps) {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const { documentId } = use(params);

  const { document, isLoading } = useGetDocumentById({ documentId });

  if (isLoading) {
    return (
      <div>
        <Cover.Skeleton />

        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div className="">Document not found.</div>;
  }

  return (
    <div className="pb-40">
      <Cover preview url={document?.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview initialData={document as Doc<"documents">} />
        <Editor
          editable={false}
          onChange={() => {}}
          initialContent={document?.content as Doc<"documents">["content"]}
        />
      </div>
    </div>
  );
}
