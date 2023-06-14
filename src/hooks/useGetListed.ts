// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { headGroupNFT } from '../utils/gfSDK';
import { parseGroupName } from '../utils';

export const useGetListed = () => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  const getList = useCallback(async () => {
    const list = await MarketPlaceContract(false)
      .methods.getListed(0, 20)
      .call();
    const { _ids, _dates } = list;
    console.log(list);
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
          console.log(item);
          const [owner, , , , extra] = attributes;
          const { type, name } = parseGroupName(groupName);
          const { price, url } = JSON.parse(extra.value);

          return {
            ...item,
            name,
            groupName,
            type,
            ownerAddress: owner.value,
            price,
            url,
            id: _ids[index],
            listTime: _dates[index],
          };
        })
        .filter((item) => item);
      setList(result);
      console.log(result, '-----getList');
    } else {
      setList([]);
    }
    setLoading(false);
  }, [address]);
  useEffect(() => {
    getList();
  }, [address]);
  return { loading, list };
};
