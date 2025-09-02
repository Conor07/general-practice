import React, { createContext, useReducer, ReactNode } from "react";

import {
  rootReducer,
  initialRootState,
  RootState,
  RootAction,
} from "./rootReducer";

export const AppContext = createContext<{
  state: RootState;
  dispatch: React.Dispatch<RootAction>;
}>({
  state: initialRootState,
  dispatch: () => null,
});

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [state, dispatch] = useReducer(rootReducer, initialRootState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
