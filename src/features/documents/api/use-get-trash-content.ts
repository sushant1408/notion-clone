import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

const useGetTrashContent = () => {
  const data = useQuery(api.documents.getTrashContent);
  const isLoading = data === undefined;

  return { documents: data, isLoading };
};

export { useGetTrashContent };
