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
      console.log(groupId, '-----prices1');
      const result = await MarketPlaceContract(false)
        .methods.prices(groupId)
        .call({ from: address });
      console.log(groupId, result, '-----prices2');
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
