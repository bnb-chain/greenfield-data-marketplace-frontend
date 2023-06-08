// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useListedStatus = () => {
  const { address } = useAccount();
  const [listStatus, setListStatus] = useState(false);

  const checkListed = useCallback(
    async (groupId: string) => {
      const result = await MarketPlaceContract()
        .methods.prices(groupId)
        .call({ from: address });
      if (result > 0) {
        setListStatus(true);
        return true;
      }
      return false;
    },
    [address],
  );

  return { checkListed, listStatus };
};
