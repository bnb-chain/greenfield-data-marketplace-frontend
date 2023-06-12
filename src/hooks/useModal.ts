import { useContext } from 'react';

import { ModalContext } from '../context/modal';

export const useModal = () => {
  const val = useContext(ModalContext);

  return val;
};
