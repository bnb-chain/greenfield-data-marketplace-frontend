// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useSalesRevenue = (groupId: string) => {
  const { address } = useAccount();
  const [salesRevenue, setSalesRevenue] = useState(0);

  useEffect(() => {
    MarketPlaceContract(false)
      .methods.salesRevenue(groupId)
      .call({ from: address })
      .then((result: any) => {
        console.log(result, '---useSalesRevenue');
        setSalesRevenue(result);
      });
  }, [address]);
  return { salesRevenue };
};
