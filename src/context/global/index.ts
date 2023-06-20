import React from 'react';

export const initialState: any = {
  breadList: [
    {
      path: '/',
      name: 'Data MarketPlace',
      query: 'tab=all',
    },
  ],
};

interface IBread {
  path: string;
  query: string;
  name: string;
}
export const defaultState: any = JSON.parse(JSON.stringify(initialState));

export interface GlobalState {
  globalState: {
    breadList: IBread[];
  };
  globalDispatch: React.Dispatch<any>;
}

export const GlobalContext = React.createContext<GlobalState>(null as any);
GlobalContext.displayName = 'GlobalContext';

export const GlobalReducer = (initialState: any, action: any) => {
  console.log(initialState, action);
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
    case 'RESET':
      return {
        ...defaultState,
      };
    default:
      console.log(initialState, '-----------initialState');
      return initialState;
  }
};

export * from './Provider';
