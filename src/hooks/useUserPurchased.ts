// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useUserPurchased = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  useEffect(() => {
    MarketPlaceContract(false)
      .methods.getUserPurchased(address, 0, 20)
      .call({ from: address })
      .then((result: any) => {
        setList(result);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);
  return { loading, list };
};
