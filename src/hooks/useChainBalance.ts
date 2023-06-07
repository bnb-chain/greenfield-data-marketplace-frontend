import { useEffect, useState, useCallback } from 'react';
import { useBalance, useAccount } from 'wagmi';

import * as env from '../env';
import { batchUpdate } from '../utils';

export const useChainBalance = () => {
  const { address, isConnected } = useAccount();

  const [BscBalanceVal, setBscBalanceVal] = useState(0);
  const [GfBalanceVal, setGfBalanceVal] = useState(0);

  const {
    data: bscBalance,
    refetch: BscBalanceRefetch,
    isLoading: l1Loading,
  } = useBalance({
    address: address,
    chainId: Number(env.BSC_CHAIN_ID),
  });
  const {
    data: gfBalance,
    refetch: GfBalanceRefetch,
    isLoading: gfLoading,
  } = useBalance({
    address: address,
    chainId: Number(env.GF_CHAIN_ID),
  });

  useEffect(() => {
    if (bscBalance) {
      setBscBalanceVal(Number(bscBalance.formatted));
    }
    if (gfBalance) {
      setGfBalanceVal(Number(gfBalance.formatted));
    }
  }, [bscBalance, gfBalance]);

  /**
   * Get latest balance every 5s
   */
  useEffect(() => {
    let mount = true;
    if (isConnected && !l1Loading && !gfLoading) {
      const requestAnimationFrameTimer = <RetT>(
        fn: () => Promise<RetT>,
        time = 0,
      ) => {
        const now = Date.now;
        let startTime = now();
        let endTime = startTime;
        let uid;

        const timer = () => {
          if (mount) {
            uid = requestAnimationFrame(timer);
          }
          endTime = now();
          if (endTime - startTime >= time) {
            startTime = now();
            endTime = startTime;
            fn();
          }
        };
        uid = requestAnimationFrame(timer);
        return uid;
      };
      requestAnimationFrameTimer(updateBalance, 5000);
      return () => {
        mount = false;
      };
    }
  }, [isConnected, l1Loading, gfLoading]);

  /**
   * Update L1 and L2 balance
   */
  const updateBalance = useCallback(async () => {
    try {
      const L2B = await GfBalanceRefetch();
      const L1B = await BscBalanceRefetch();
      batchUpdate(() => {
        setBscBalanceVal(Number(L1B.data?.formatted));
        setGfBalanceVal(Number(L2B.data?.formatted));
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }, []);

  return {
    bscBalance,
    gfBalance,
    BscBalanceVal,
    GfBalanceVal,
    BscBalanceRefetch,
    GfBalanceRefetch,
    updateBalance,
    setBscBalanceVal,
    setGfBalanceVal,
  };
};
