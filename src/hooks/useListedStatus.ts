// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useListedStatus = (groupId?: string) => {
  const { address } = useAccount();
  const [listStatus, setListStatus] = useState(false);
  const [price, setPrice] = useState(0);
  const checkListed = useCallback(
    async (groupId: string) => {
      if (groupId) {
        const result = await MarketPlaceContract(false)
          .methods.prices(groupId)
          .call({ from: address });
        if (result > 0) {
          setPrice(result);
          setListStatus(true);
          return result;
        }
      }
      return false;
    },
    [address],
  );

  useEffect(() => {
    groupId && checkListed(groupId);
  }, [groupId]);
  return { checkListed, listStatus, price };
};
