// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { headGroupNFT } from '../utils/gfSDK';
import { parseGroupName } from '../utils';

export const useUserPurchased = () => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  useEffect(() => {
    MarketPlaceContract(false)
      .methods.getUserPurchased(address, 0, 20)
      .call({ from: address })
      .then(async (result: any) => {
        const { _ids, _dates } = result;
        if (Array.isArray(_ids)) {
          const t = _ids.map((item: any) => {
            return headGroupNFT(item);
          });
          let result = await Promise.all(t);
          result = result.map((item: any, index) => {
            const {
              metaData: { attributes, groupName },
            } = item;
            const [owner, , , , extra] = attributes;
            const { type, name } = parseGroupName(groupName);
            return {
              ...item,
              name,
              groupName,
              type,
              ownerAddress: owner.value,
              price: JSON.parse(extra.value).price,
              id: _ids[index],
              listTime: _dates[index],
            };
          });
          console.log(result, '---getUserPurchased');
          setList(result);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);
  return { loading, list };
};
