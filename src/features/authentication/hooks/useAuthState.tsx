import { useAppSelector } from "../../../store/redux/hooks";

function useAuthState() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userName = useAppSelector((state) => state.auth.userName);

  return { isLoggedIn, userName };
}

export default useAuthState;
