import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { setUser, setToken, setIsAuthenticated } from "./authSlice";
import { User } from "@/types/auth";

export const useAuthSelector = () =>
  useSelector.withTypes<RootState>()((state) => state.auth);

export const useAuthDispatch = () => {
  const dispatch = useDispatch.withTypes<AppDispatch>()();

  return {
    setUser: (user: User) => dispatch(setUser(user)),
    setToken: (token: string) => dispatch(setToken(token)),
    setIsAuthenticated: (isAuthenticated: boolean) =>
      dispatch(setIsAuthenticated(isAuthenticated)),
  };
};

// export all the hooks from the authApi
export { useSignUpMutation } from "./authApi";
