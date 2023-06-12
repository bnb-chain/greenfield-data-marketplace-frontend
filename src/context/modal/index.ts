import React from 'react';

export const initialState: any = {
  openList: false,
  openListProcess: false,
  openListError: false,
  listData: {},
  initInfo: {},
  initListStatus: 0,
  initListResult: {},
};

export const defaultState: any = JSON.parse(JSON.stringify(initialState));

export interface ModalState {
  modalState: {
    openList: boolean;
    openListProcess: boolean;
    openListError: boolean;
    listData: object;
    initInfo: object;
    initListStatus: number;
    initListResult: object;
  };
  modalDispatch: React.Dispatch<any>;
}

export const ModalContext = React.createContext<ModalState>(null as any);
ModalContext.displayName = 'ModalContext';

export const ModalReducer = (initialState: any, action: any) => {
  console.log(initialState, action);
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
    case 'OPEN_LIST_ERROR':
      return {
        ...initialState,
        openList: false,
        openListProcess: false,
        openListError: true,
      };
    case 'CLOSE_LIST_ERROR':
      return {
        ...initialState,
        openListError: false,
      };
    case 'UPDATE_LIST_DATA':
      return { ...initialState, listData: action.listData };
    case 'UPDATE_LIST_STATUS':
      return {
        ...initialState,
        initListStatus: action.initListStatus,
        initListResult: action.initListResult,
      };
    case 'RESET':
      return defaultState;
    default:
      console.log(initialState, '-----------initialState');
      return initialState;
  }
};

export * from './Provider';
