import { useContext } from 'react';

import { WalletModalContext } from '../context/walletModal';

export const useWalletModal = () => {
  const val = useContext(WalletModalContext);

  const handleModalOpen = () => {
    val.modalDispatch({ type: 'OPEN' });
  };

  const handleModalClose = () => {
    val.modalDispatch({ type: 'CLOSE' });
  };

  return { modalData: val, handleModalOpen, handleModalClose };
};
