import React, { ReactNode, useReducer } from 'react';

import { WalletModalReducer, WalletModalContext, initialState } from '.';

interface WalletModalProviderProps {
  children: ReactNode;
}

export const WalletModalProvider: React.ComponentType<
  WalletModalProviderProps
> = (props: WalletModalProviderProps) => {
  const { children } = props;
  const [modalState, modalDispatch] = useReducer(
    WalletModalReducer,
    initialState,
  );

  return (
    <WalletModalContext.Provider
      value={{ modalState: modalState, modalDispatch: modalDispatch }}
    >
      {children}
    </WalletModalContext.Provider>
  );
};
WalletModalProvider.displayName = 'WalletModalProvider';
