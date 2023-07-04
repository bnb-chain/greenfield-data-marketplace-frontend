import React from 'react';
import { getUrlParam } from '../../utils';

interface IInitialState {
  breadList: Array<{
    path: string;
    name: string;
    query: string;
  }>;
  showSearch: boolean;
}

export const initialState: IInitialState = {
  breadList: [
    {
      path: '/',
      name: 'Data MarketPlace',
      query: '',
    },
  ],
  showSearch: false,
};

interface IBread {
  path: string;
  query: string;
  name: string;
}
export const defaultState: any = JSON.parse(JSON.stringify(initialState));

try {
  const from = decodeURIComponent(getUrlParam('from'));
  initialState.breadList = JSON.parse(from);
} catch (e) {}

export interface GlobalState {
  globalState: {
    breadList: IBread[];
    showSearch: boolean;
  };
  globalDispatch: React.Dispatch<any>;
}

export const GlobalContext = React.createContext<GlobalState>(null as any);
GlobalContext.displayName = 'GlobalContext';

export const GlobalReducer = (initialState: any, action: any) => {
  const cp = JSON.parse(JSON.stringify(initialState));
  switch (action.type) {
    case 'ADD_BREAD':
      cp.breadList.push(action.item);
      return {
        ...cp,
      };
    case 'DEL_BREAD':
      const index = cp.breadList.findIndex(
        (element: IBread) => element.name === action.name,
      );
      cp.breadList = cp.breadList.splice(0, index);
      return {
        ...cp,
      };
    case 'UPDATE_BREAD':
      cp.breadList = cp.breadList.splice(action.index, 1, action.item);
      return {
        ...cp,
      };
    case 'INIT_BREAD':
      cp.breadList = action.list;
      return {
        ...cp,
      };
    case 'SEARCH_STATUS':
      cp.showSearch = action.showSearch;
      return {
        ...cp,
      };
    case 'RESET':
      return {
        ...defaultState,
      };
    default:
      return initialState;
  }
};

export * from './Provider';
