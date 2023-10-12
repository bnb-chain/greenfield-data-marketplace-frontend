import { useEffect, useState } from 'react';
// import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
// import { headGroupNFT } from '../utils/gfSDK';
import { parseGroupName } from '../utils';
import { getListedList } from '../utils/http';

// export const useUserListed = (address: string, page: number, pageSize = 10) => {
//   const [list, setList] = useState(<any>[]);
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     MarketPlaceContract(false)
//       .methods.getUserListed(address, (page - 1) * pageSize, pageSize)
//       .call()
//       .then(async (res: any) => {
//         const { _ids, _totalLength, _dates } = res;
//         const t = _ids.map((item: any) => {
//           return headGroupNFT(item);
//         });
//         let result = await Promise.all(t);
//         result = result
//           .map((item: any, index) => {
//             if (!Object.keys(item).length) return false;
//             const {
//               metaData: { attributes, groupName },
//             } = item;
//             const [owner, , , , extra] = attributes;
//             const { type, name } = parseGroupName(groupName);
//             const { price, url } = JSON.parse(extra.value);

//             return {
//               ...item,
//               name,
//               groupName,
//               type,
//               ownerAddress: owner.value,
//               price,
//               url,
//               id: _ids[index],
//               listTime: _dates[index],
//             };
//           })
//           .filter((item) => item);
//         setList(result);
//         setTotal(_totalLength);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [address, page, pageSize]);
//   return { loading, list, total };
// };

export const useUserListed = (address: string, page: number, pageSize = 10) => {
  const [list, setList] = useState(<any>[]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getListedList({
      filter: {
        address,
        keyword: '',
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      sort: 'CREATION_DESC',
    })
      .then(async (res: any) => {
        const { items, total } = res;
        if (Array.isArray(items)) {
          let result: any = [];
          result = items
            .map((item: any) => {
              if (!Object.keys(item).length) return false;
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
          setList([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address, page, pageSize]);
  return { loading, list, total };
};
