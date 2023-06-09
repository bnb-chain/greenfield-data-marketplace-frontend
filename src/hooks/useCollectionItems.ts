import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getBucketFileList } from '../utils/gfSDK';

export const useCollectionItems = (bucketName: string) => {
  // 0 owner
  // 1 Waiting for purchase
  // 2 purchase
  const { address } = useAccount();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [num, setNum] = useState(0);

  useEffect(() => {
    if (bucketName) {
      getBucketFileList({ bucketName })
        .then((result: any) => {
          console.log(bucketName, result);
          const { body, code } = result;

          if (code == 0) {
            const { key_count, objects } = body;
            setList(objects);
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
