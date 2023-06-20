// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { headGroupNFT } from '../utils/gfSDK';
import { parseGroupName } from '../utils';

export const useUserPurchased = (page: number, pageSize = 10) => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const { address } = useAccount();

  useEffect(() => {
    setLoading(true);
    MarketPlaceContract(false)
      .methods.getUserPurchased(address, page, pageSize)
      .call({ from: address })
      .then(async (result: any) => {
        const { _ids, _dates, _totalLength } = result;

        if (Array.isArray(_ids)) {
          const t = _ids.map((item: any) => {
            return headGroupNFT(item);
          });
          let result = await Promise.all(t);
          result = result
            .map((item: any, index) => {
              if (!Object.keys(item).length) return false;
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
            })
            .filter((item) => item);
          console.log(result, '---getUserPurchased');
          setList(result);
          setTotal(_totalLength);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address, page, pageSize]);
  return { loading, list, total };
};
