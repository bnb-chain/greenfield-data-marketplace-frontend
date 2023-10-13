// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
// import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
// import { headGroupNFT } from '../utils/gfSDK';
import { parseGroupName } from '../utils';
import { getPurchaseList } from '../utils/http';

// export const useUserPurchased = (page: number, pageSize = 10) => {
//   const [list, setList] = useState(<any>[]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);

//   const { address } = useAccount();

//   useEffect(() => {
//     setLoading(true);
//     MarketPlaceContract(false)
//       .methods.getUserPurchased(address, (page - 1) * pageSize, pageSize)
//       .call({ from: address })
//       .then(async (result: any) => {
//         const { _ids, _dates, _totalLength } = result;
//         if (Array.isArray(_ids)) {
//           const t = _ids.map((item: any) => {
//             return headGroupNFT(item);
//           });
//           let result = await Promise.all(t);
//           result = result
//             .map((item: any, index) => {
//               if (!Object.keys(item).length) return false;
//               const {
//                 metaData: { attributes, groupName },
//               } = item;
//               const [owner, , , , extra] = attributes;
//               const { type, name } = parseGroupName(groupName);

//               const _extra = JSON.parse(extra.value);
//               return {
//                 ...item,
//                 name,
//                 groupName,
//                 type,
//                 ownerAddress: owner.value,
//                 price: _extra.price,
//                 url: _extra.url,
//                 id: _ids[index],
//                 listTime: _dates[index],
//               };
//             })
//             .filter((item) => item);
//           setList(result);
//           setTotal(_totalLength);
//         } else {
//           setLoading(false);
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [address, page, pageSize]);
//   return { loading, list, total };
// };

export const useUserPurchased = (page: number, pageSize = 10) => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const { address } = useAccount();

  useEffect(() => {
    setLoading(true);
    getPurchaseList({
      filter: {
        address,
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      sort: 'CREATION_DESC',
    })
      .then(async (result: any) => {
        const { purchases, total } = result;
        if (Array.isArray(purchases)) {
          let result: any = [];
          result = purchases
            .map((data: any) => {
              if (!Object.keys(data).length) return false;
              const { item } = data;
              const { type, name } = parseGroupName(item.groupName);

              return {
                ...item,
                type,
                name,
                id: item.groupId,
                listTime: item.createdAt,
                metaData: { groupName: item.groupName },
                totalVol: item.totalSale || '0',
              };
            })
            .filter((item) => item);
          setList(result);
          setTotal(total);
        } else {
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address, page, pageSize]);
  return { loading, list, total };
};
