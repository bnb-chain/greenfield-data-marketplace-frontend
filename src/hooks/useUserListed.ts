import { useEffect, useState } from 'react';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { headGroupNFT } from '../utils/gfSDK';
import { parseGroupName } from '../utils';

export const useUserListed = (address: string, page: number, pageSize = 10) => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    MarketPlaceContract(false)
      .methods.getUserListed(address, (page - 1) * pageSize, pageSize)
      .call()
      .then(async (res: any) => {
        const { _ids, _totalLength, _dates } = res;
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
        setTotal(_totalLength);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address, page, pageSize]);
  return { loading, list, total };
};
