import { configureStore, StateFromReducersMapObject } from "@reduxjs/toolkit";
import { instanceApi } from "./features/instance/instanceApi";
import { statsApi } from "./features/stats/statsApi";
import { authApi } from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import { loadLocalStorage } from "@/lib/utils";

const reducer = {
  [instanceApi.reducerPath]: instanceApi.reducer,
  [statsApi.reducerPath]: statsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  auth: authReducer,
};

type PreloadedState = StateFromReducersMapObject<typeof reducer>;

const preloadedState: PreloadedState = loadLocalStorage();

export const makeStore = () => {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        instanceApi.middleware,
        statsApi.middleware,
        authApi.middleware
      ),
    devTools: true,
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
