// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getBucketList } from '../utils/gfSDK';

export const useCollectionList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  useEffect(() => {
    getBucketList(address as string)
      .then((result: any) => {
        console.log(result, '-------getBucketList');
        const { statusCode, body } = result;
        if (statusCode == 200 && Array.isArray(body)) {
          setList(body as any);
        }
        console.log(result);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);
  return { loading, list };
};
