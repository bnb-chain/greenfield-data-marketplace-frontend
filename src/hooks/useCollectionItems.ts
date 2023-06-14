import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getBucketFileList, getGroupInfoByName } from '../utils/gfSDK';
import { generateGroupName } from '../utils';
import { useListedStatus } from './useListedStatus';

export const useCollectionItems = (bucketName: string) => {
  // 0 owner
  // 1 Waiting for purchase
  // 2 purchase
  const { address } = useAccount();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [num, setNum] = useState(0);

  const { checkListed } = useListedStatus();
  useEffect(() => {
    if (bucketName && address) {
      getBucketFileList({ bucketName })
        .then((result: any) => {
          console.log(bucketName, result);
          const { body, code } = result;

          if (code == 0) {
            const { key_count, objects } = body;

            const t = objects.map(async (item: any) => {
              const {
                object_info: { bucket_name, object_name },
              } = item;
              const groupName = generateGroupName(bucket_name, object_name);
              console.log(groupName);
              const { groupInfo } = await getGroupInfoByName(
                groupName,
                address as string,
              );
              console.log(groupInfo);
              if (!groupInfo) return item;
              const { id } = groupInfo;
              const result = await checkListed(id);
              return { ...item, groupId: id, listed: !!result, price: result };
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

            setNum(key_count);
          } else {
            setList([]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [bucketName, address]);

  return { loading, list, num };
};
