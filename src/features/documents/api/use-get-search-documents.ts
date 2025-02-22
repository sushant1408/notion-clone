import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

const useGetSearchDocuments = () => {
  const data = useQuery(api.documents.getSearch);
  const isLoading = data === undefined;

  return { documents: data, isLoading };
};

export { useGetSearchDocuments };
