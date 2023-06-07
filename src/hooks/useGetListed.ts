// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { headGroupNFT } from '../utils/gfSDK';

export const useGetListed = () => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  const getList = useCallback(async () => {
    const list = await MarketPlaceContract(false)
      .methods.getListed(0, 20)
      .call({ from: address });
    const { _ids, _dates } = list;
    console.log(list);
    if (Array.isArray(_ids)) {
      const t = _ids.map((item: any) => {
        return headGroupNFT(item);
      });
      let result = await Promise.all(t);
      result = result.map((item: any, index) => {
        const {
          metaData: { attributes, groupName },
        } = item;
        console.log(item);
        const [owner, , , , extra] = attributes;
        let name = groupName;
        let type = 'Collection';
        if (name.indexOf('dm_') === 0) {
          if (name.indexOf('dm_o_') === 0) {
            type = 'Data';
          }
          name = name.split('_').slice(-1)[0];
        }
        return {
          ...item,
          name,
          type,
          ownerAddress: owner.value,
          price: JSON.parse(extra.value).price,
          id: _ids[index],
          listTime: _dates[index],
        };
      });
      setList(result);
      console.log(result, '-----getList');
    } else {
      setList([]);
    }
    setLoading(false);
  }, [address]);
  useEffect(() => {
    getList();
  }, []);
  return { loading, list };
};
