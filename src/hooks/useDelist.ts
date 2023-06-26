// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useDelist = () => {
  const { address } = useAccount();

  const delist = useCallback(
    async (groupId: string) => {
      return await MarketPlaceContract()
        .methods.delist(groupId)
        .send({ from: address });
    },
    [address],
  );

  return { delist };
};
