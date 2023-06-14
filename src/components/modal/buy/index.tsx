import { useCallback, useMemo, useState } from 'react';
import { BuyModal } from './buyModal';
import { BuyProcess } from './buyProcess';
import { BuyResult } from '../buyResult';
import { useModal } from '../../../hooks/useModal';

export const BuyIndex = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState(0);

  const state = useModal();
  const { buying, openBuy, buyEnd, buyResult } = state.modalState;

  const handleBuyOpen = useCallback(() => {
    state.modalDispatch({ type: 'CLOSE_BUY' });
  }, []);

  const handleBuyEndOpen = useCallback(() => {
    state.modalDispatch({ type: 'CLOSE_BUY_END' });
  }, []);

  const variant = useMemo(() => {
    const { status, transactionHash } = buyResult as any;
    if (status && transactionHash) return 'success';
    return 'error';
  }, [buyEnd, buyResult]);

  const description = useMemo(() => {
    console.log(buyResult, '-----buyResult');
    const { status, transactionHash, code, message } = buyResult as any;
    if (status && transactionHash) return 'Purchase successful';
    return code ? message : 'Purchase failed';
  }, [buyEnd, buyResult]);

  return (
    <>
      {/* {isOpen && step == 0 && ( */}
      <BuyModal isOpen={openBuy} handleOpen={handleBuyOpen}></BuyModal>
      {/* )} */}
      <BuyProcess isOpen={buying}></BuyProcess>

      <BuyResult
        isOpen={buyEnd}
        variant={variant}
        description={description}
        handleOpen={handleBuyEndOpen}
      ></BuyResult>
      {/* {isOpen && step == 2 && <BuyModal></BuyModal>} */}
    </>
  );
};
