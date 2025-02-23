import { useQuery } from "convex/react";
import { Metadata } from "next";
import { ReactNode } from "react";

import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

interface DocumentIdLayoutProps {
    params: Promise<{ documentId: Id<"documents"> }>;
}

export async function generateMetadata({ params }: DocumentIdLayoutProps): Promise<Metadata> {
  const { documentId } = await params;
  const data = useQuery(api.documents.getDocumentById, { documentId });

  console.log({data});

  return {
    title: ""
  };
}

export default function DocumentIdLayout({children}: {children: ReactNode}) {
  return <>{children}</>;
}