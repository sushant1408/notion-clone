"use client";

import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";

import { useGetDocumentById } from "@/features/documents/api/use-get-document-by-id";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";
import { Title } from "./title";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams<{ documentId: Id<"documents"> }>();

  const { document, isLoading } = useGetDocumentById({
    documentId: params.documentId,
  });

  if (isLoading) {
    return (
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="!size-6 text-muted-foreground"
          />
        )}

        <div className="flex items-center justify-between w-full">
          <Title initialData={document as Doc<"documents">} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document!} />
            <Menu documentId={document!._id} />
          </div>
        </div>
      </nav>

      {document?.isArchived && <Banner documentId={document._id} />}
    </>
  );
};

export { Navbar };
