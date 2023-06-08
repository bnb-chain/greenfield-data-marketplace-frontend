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

export const useCollectionList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  const { checkListed } = useListedStatus();

  useEffect(() => {
    getBucketList(address as string).then(async (result: any) => {
      const { statusCode, body } = result;
      if (statusCode == 200 && Array.isArray(body)) {
        const t = body.map(async (item) => {
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
          })
          .catch((error) => {
            setList([]);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  }, [address]);
  return { loading, list };
};
