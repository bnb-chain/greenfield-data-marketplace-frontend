import { useCallback } from 'react';
import { BuyModal } from './BuyModal';
import { BuyProcess } from './BuyProcess';
import { useModal } from '../../../hooks/useModal';

export const BuyIndex = () => {
  const state = useModal();
  const { buying, openBuy } = state.modalState;

  const handleBuyOpen = useCallback(() => {
    state.modalDispatch({ type: 'CLOSE_BUY' });
  }, []);

  return (
    <>
      <BuyModal isOpen={openBuy} handleOpen={handleBuyOpen}></BuyModal>
      {/* )} */}
      <BuyProcess isOpen={buying}></BuyProcess>
    </>
  );
};
