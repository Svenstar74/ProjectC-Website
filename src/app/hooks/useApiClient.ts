import { ApiClient } from "../ApiClient/ApiClient";
import { useAppSelector } from "../store/hooks";

export const useApiClient = () => {
  const user = useAppSelector((state) => state.auth.user);
  const apiClient = new ApiClient(user);
  
  return apiClient;
}