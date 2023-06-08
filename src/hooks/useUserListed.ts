// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useUserPurchased = () => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  const checklist = (groupId: string) => {
    return groupId;
  };

  useEffect(() => {
    MarketPlaceContract(false)
      .methods.getUserListed(address, 0, 20)
      .call({ from: address })
      .then((result: any) => {
        console.log(result, '---getUserListed');
        const { _ids } = result;
        if (Array.isArray(_ids)) {
          setList(_ids);
        }
        setList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);
  return { loading, list };
};
