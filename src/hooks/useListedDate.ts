import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useListedDate = (groupId: string) => {
  const { address } = useAccount();
  const [listedDate, setListedDate] = useState(0);

  useEffect(() => {
    if (groupId) {
      MarketPlaceContract(false)
        .methods.listedDate(groupId)
        .call({ from: address })
        .then((result: any) => {
          setListedDate(result);
        });
    }
  }, [address, groupId]);
  return { listedDate };
};
