import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetDocumentByIdProps {
  documentId: Id<"documents">;
}

const useGetDocumentById = ({ documentId }: UseGetDocumentByIdProps) => {
  const data = useQuery(api.documents.getDocumentById, { documentId });
  const isLoading = data === undefined;

  return { document: data, isLoading };
};

export { useGetDocumentById };
