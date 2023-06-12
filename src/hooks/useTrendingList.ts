// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { headGroupNFT } from '../utils/gfSDK';
import { parseGroupName } from '../utils';

export const useTrendingList = () => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  useEffect(() => {
    MarketPlaceContract(false)
      .methods.getSalesVolumeRanking()
      .call({ from: address })
      .then(async (result: any) => {
        const { _ids, _dates, _volumes } = result;
        if (Array.isArray(_ids)) {
          const t = _ids
            .filter((item: string) => {
              return Number(item) > 0;
            })
            .map((item: any) => {
              return headGroupNFT(item);
            });

          let result = await Promise.all(t);
          result = result.map((item: any, index) => {
            console.log(item);
            const {
              metaData: { attributes, groupName },
            } = item;
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
              totalVol: _volumes[index],
              rank: index + 1,
            };
          });
          console.log(result, '---useTrendingList');
          setList(result);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, list };
};
