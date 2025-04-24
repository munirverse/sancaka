import { configureStore } from "@reduxjs/toolkit";
import { instanceApi } from "./features/instance/instanceApi";
import { statsApi } from "./features/stats/statsApi";
import { authApi } from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      [instanceApi.reducerPath]: instanceApi.reducer,
      [statsApi.reducerPath]: statsApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        instanceApi.middleware,
        statsApi.middleware,
        authApi.middleware
      ),
    devTools: true,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
