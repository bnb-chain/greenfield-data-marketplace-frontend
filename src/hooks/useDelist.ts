// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { BSC_SEND_GAS_FEE } from '../env';

export const useDelist = () => {
  const { address } = useAccount();

  const delist = useCallback(
    async (groupId: string) => {
      return await MarketPlaceContract()
        .methods.delist(groupId)
        .send({ from: address, gasPrice: BSC_SEND_GAS_FEE });
    },
    [address],
  );

  return { delist };
};
