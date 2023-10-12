// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
// import { useAccount } from 'wagmi';
// import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
// import { headGroupNFT } from '../utils/gfSDK';
import { parseGroupName } from '../utils';
import { getListedList } from '../utils/http';

// export const useTrendingList = () => {
//   const [list, setList] = useState(<any>[]);
//   const [loading, setLoading] = useState(true);

//   const { address } = useAccount();

//   useEffect(() => {
//     MarketPlaceContract(false)
//       .methods.getSalesVolumeRanking()
//       .call({ from: address })
//       .then(async (result: any) => {
//         const { _ids, _dates, _volumes } = result;
//         if (Array.isArray(_ids)) {
//           const t = _ids
//             .filter((item: string) => {
//               return Number(item) > 0;
//             })
//             .map((item: any) => {
//               return headGroupNFT(item);
//             });

//           let result = await Promise.all(t);
//           result = result
//             .filter((item: any) => !!item.metaData)
//             .map((item: any, index) => {
//               const {
//                 metaData: { attributes, groupName },
//               } = item;
//               const [owner, , , , extra] = attributes;
//               const { type, name } = parseGroupName(groupName);

//               let price;
//               let url;
//               try {
//                 const extraObj = JSON.parse(extra.value);
//                 price = extraObj.price;
//                 url = extraObj.url;
//               } catch (e) {}

//               return {
//                 ...item,
//                 name,
//                 groupName,
//                 type,
//                 ownerAddress: owner.value,
//                 price,
//                 url,
//                 id: _ids[index],
//                 listTime: _dates[index],
//                 totalVol: _volumes[index],
//                 rank: index + 1,
//               };
//             });
//           setList(result);
//         } else {
//           setLoading(false);
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   return { loading, list };
// };

export const useTrendingList = () => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListedList({
      filter: {
        address: '',
        keyword: '',
      },
      limit: 10,
      offset: 0,
      sort: 'TOTAL_SALE_DESC',
    })
      .then(async (result: any) => {
        let { items } = result;
        if (Array.isArray(items)) {
          items = items
            .map((item: any, index: number) => {
              const { type, name } = parseGroupName(item.groupName);
              return {
                ...item,
                type,
                name,
                id: item.groupId,
                listTime: item.createdAt,
                totalVol: item.totalSale || '0',
                rank: index + 1,
                metaData: { groupName: item.groupName },
              };
            })
            .filter((item) => item.totalSale >= 0);
          setList(items);
        } else {
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, list };
};
