import React from 'react';

export const initialState = {
  open: false,
};

export interface ModalState {
  modalState: {
    open: boolean;
  };
  modalDispatch: React.Dispatch<any>;
}

export const WalletModalContext = React.createContext<ModalState>(null as any);
WalletModalContext.displayName = 'WalletModalContext';

export const WalletModalReducer = (initialState: any, action: any) => {
  switch (action.type) {
    case 'OPEN':
      return {
        open: true,
      };
    case 'CLOSE':
      return {
        open: false,
      };
    default:
      return initialState;
  }
};

export * from './Provider';
