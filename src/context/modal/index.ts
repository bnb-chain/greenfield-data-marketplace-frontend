import { StateModalVariantType } from '@totejs/uikit';
import React from 'react';

export const initialState: any = {
  openList: false,
  openListProcess: false,
  openBuy: false,
  buying: false,
  openDelist: false,
  openResult: false,
  listData: {},
  buyData: {},
  initInfo: {},
  delistData: {},
  result: {},
  initListStatus: 0,
  initListResult: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  callBack: () => {},
};

export const defaultState: any = JSON.parse(JSON.stringify(initialState));

export interface ModalState {
  modalState: {
    openList: boolean;
    openListProcess: boolean;
    openBuy: boolean;
    buying: boolean;
    listData: object;
    buyData: object;
    initInfo: object;
    initListStatus: number;
    initListResult: object;
    openDelist: boolean;
    delistData: object;
    openResult: boolean;
    result: {
      variant: StateModalVariantType;
      description: string;
    };
    callBack: () => void;
  };
  modalDispatch: React.Dispatch<any>;
}

export const ModalContext = React.createContext<ModalState>(null as any);
ModalContext.displayName = 'ModalContext';

export const ModalReducer = (initialState: any, action: any) => {
  switch (action.type) {
    case 'OPEN_LIST':
      return {
        ...initialState,
        openList: true,
        initInfo: action.initInfo,
      };
    case 'CLOSE_LIST':
      return { ...initialState, openList: false };
    case 'OPEN_LIST_PROCESS':
      return {
        ...initialState,
        openListProcess: true,
        openList: false,
        listData: action.listData,
      };
    case 'CLOSE_LIST_PROCESS':
      return {
        ...initialState,
        openListProcess: false,
      };
    case 'UPDATE_LIST_DATA':
      return { ...initialState, listData: action.listData };
    case 'UPDATE_LIST_STATUS':
      return {
        ...initialState,
        initListStatus: action.initListStatus,
        initListResult: action.initListResult,
        listData: action.listData || initialState.listData,
      };
    case 'OPEN_BUY':
      return {
        ...initialState,
        openBuy: true,
        buyData: action.buyData,
      };
    case 'BUYING':
      return {
        ...initialState,
        buying: true,
        openBuy: false,
      };
    case 'CLOSE_BUY':
      return {
        ...initialState,
        openBuy: false,
      };
    case 'OPEN_DELIST':
      return {
        ...initialState,
        openDelist: true,
        delistData: action.delistData,
      };
    case 'CLOSE_DELIST':
      return {
        ...initialState,
        openDelist: false,
      };
    case 'OPEN_RESULT':
      return {
        ...initialState,
        openList: false,
        openListProcess: false,
        openListError: false,
        openBuy: false,
        buying: false,
        openDelist: false,
        openResult: true,
        result: action.result,
        callBack: action.callBack,
      };
    case 'CLOSE_RESULT':
      return {
        ...initialState,
        openResult: false,
      };
    case 'RESET':
      return defaultState;
    default:
      return initialState;
  }
};

export * from './Provider';
