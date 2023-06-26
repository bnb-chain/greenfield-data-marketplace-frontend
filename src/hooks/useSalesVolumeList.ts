// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useSalesVolumeList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  useEffect(() => {
    MarketPlaceContract(false)
      .methods.getSalesVolume(0, 20)
      .call({ from: address })
      .then((result: any) => {
        setList(result);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return { loading, list };
};
