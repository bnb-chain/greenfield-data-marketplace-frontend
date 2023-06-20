import { useContext } from 'react';

import { GlobalContext } from '../context/global';

export const useGlobal = () => {
  const val = useContext(GlobalContext);

  return val;
};
