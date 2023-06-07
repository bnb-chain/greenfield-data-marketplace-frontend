// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useTrendingList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  useEffect(() => {
    MarketPlaceContract()
      .methods.getSalesRevenueRanking()
      .call({ from: address })
      .then((result: any) => {
        setList(result);
        console.log(result);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, list };
};
