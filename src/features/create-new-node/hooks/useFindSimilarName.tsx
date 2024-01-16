import { useMutation } from "@tanstack/react-query";
import { IApiResponse } from "../../../services/api-service/IApiResponse";
import { IMostSimilarNameRequest, IMostSimilarNameResponse, postFindMostSimilarName } from "../api";

function useFindSimilarName() {
  const mutation = useMutation<IApiResponse<IMostSimilarNameResponse>, IApiResponse<null>, IMostSimilarNameRequest>({
    mutationFn: postFindMostSimilarName,
  });

  return {
    findSimilarName: mutation.mutate,
    ...mutation,
  };
}

export default useFindSimilarName;
