import { configureStore } from "@reduxjs/toolkit";
import { instanceApi } from "./features/instance/instanceApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [instanceApi.reducerPath]: instanceApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(instanceApi.middleware),
    devTools: true,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
