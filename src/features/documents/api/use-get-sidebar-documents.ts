import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetSidebarDocumentsProps {
  parentDocument?: Id<"documents">;
}

const useGetSidebarDocuments = ({ parentDocument }: UseGetSidebarDocumentsProps) => {
  const data = useQuery(api.documents.getSidebar, { parentDocument });
  const isLoading = data === undefined;

  return { documents: data, isLoading };
};

export { useGetSidebarDocuments };
