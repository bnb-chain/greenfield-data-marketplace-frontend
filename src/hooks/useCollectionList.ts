// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  checkGroupExistById,
  getBucketList,
  getGroupInfoByName,
} from '../utils/gfSDK';
import { generateGroupName } from '../utils';
import { useListedStatus } from './useListedStatus';

export const useCollectionList = (page: number, pageSize = 10) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const { address } = useAccount();

  const { checkListed } = useListedStatus();

  useEffect(() => {
    if (address) {
      setLoading(true);
      getBucketList(address as string).then(async (result: any) => {
        const { statusCode, body } = result;
        if (statusCode == 200 && Array.isArray(body)) {
          const t = body
            .slice((page - 1) * pageSize, page * pageSize)
            .map(async (item) => {
              const {
                bucket_info: { bucket_name },
              } = item;
              const groupName = generateGroupName(bucket_name);
              const { groupInfo } = await getGroupInfoByName(
                groupName,
                address as string,
              );
              if (!groupInfo) return item;
              const { id } = groupInfo;
              const result = await checkListed(id);
              return { ...item, groupId: id, listed: !!result };
            });
          Promise.all(t)
            .then((res: any) => {
              setList(res);
              setTotal(body.length);
            })
            .catch((error) => {
              setList([]);
              setTotal(0);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    }
  }, [address, page, pageSize]);
  return { loading, list, total };
};
