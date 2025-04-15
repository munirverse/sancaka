import { configureStore } from "@reduxjs/toolkit";
import { instanceApi } from "./features/instance/instanceApi";
import { statsApi } from "./features/stats/statsApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [instanceApi.reducerPath]: instanceApi.reducer,
      [statsApi.reducerPath]: statsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        instanceApi.middleware,
        statsApi.middleware
      ),
    devTools: true,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
