import React, { ReactNode, useReducer } from 'react';

import { ModalReducer, ModalContext, initialState } from '.';

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.ComponentType<ModalProviderProps> = (
  props: ModalProviderProps,
) => {
  const { children } = props;
  const [modalState, modalDispatch] = useReducer(ModalReducer, initialState);

  return (
    <ModalContext.Provider
      value={{ modalState: modalState, modalDispatch: modalDispatch }}
    >
      {children}
    </ModalContext.Provider>
  );
};
ModalProvider.displayName = 'ModalProvider';
