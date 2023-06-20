import React, { ReactNode, useReducer } from 'react';

import { GlobalReducer, GlobalContext, initialState } from '.';

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.ComponentType<GlobalProviderProps> = (
  props: GlobalProviderProps,
) => {
  const { children } = props;
  const [globalState, globalDispatch] = useReducer(GlobalReducer, initialState);

  return (
    <GlobalContext.Provider
      value={{
        globalState: globalState,
        globalDispatch: globalDispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
GlobalProvider.displayName = 'GlobalProvider';
