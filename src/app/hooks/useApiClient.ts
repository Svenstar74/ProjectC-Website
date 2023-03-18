import { ApiClient } from '../services/ApiClient';
import { useAppSelector } from '../store/redux/hooks';

export const useApiClient = () => {
  const user = useAppSelector((state) => state.auth.user);
  const apiClient = new ApiClient(user);

  return apiClient;
};
