// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
// import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { getItemDetail } from '../utils/http';

// export const useSalesVolume = (groupId: string) => {
//   const { address } = useAccount();
//   const [salesVolume, setSalesVolume] = useState(0);

//   useEffect(() => {
//     if (groupId) {
//       MarketPlaceContract(false)
//         .methods.salesVolume(groupId)
//         .call({ from: address })
//         .then((result: any) => {
//           setSalesVolume(result);
//         });
//     }
//   }, [address, groupId]);
//   return { useSalesVolume, salesVolume };
// };

export const useSalesVolume = (groupId: string) => {
  const { address } = useAccount();
  const [salesVolume, setSalesVolume] = useState(0);

  useEffect(() => {
    if (groupId) {
      getItemDetail(groupId).then((result: any) => {
        setSalesVolume(result.totalSale);
      });
    }
  }, [address, groupId]);
  return { useSalesVolume, salesVolume };
};
