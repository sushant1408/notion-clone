import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetDocumentsProps {
  parentDocument?: Id<"documents">;
}

const useGetDocuments = ({ parentDocument }: UseGetDocumentsProps) => {
  const data = useQuery(api.documents.getSidebar, { parentDocument });
  const isLoading = data === undefined;

  return { documents: data, isLoading };
};

export { useGetDocuments };
