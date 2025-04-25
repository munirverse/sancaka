"use client";

import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";
import { saveLocalStorage } from "@/lib/utils";

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.subscribe(() => {
      const state = storeRef!.current!.getState();
      saveLocalStorage({ auth: state.auth });
    });
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
