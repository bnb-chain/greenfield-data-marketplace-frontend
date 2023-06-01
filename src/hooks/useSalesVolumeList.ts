// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useEffect, useState } from 'react';
import { useWeb3 } from './useWeb3';
import { useAccount } from 'wagmi';

export const useSalesVolumeList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();

  const contractInstance = useWeb3();

  useEffect(() => {
    contractInstance.methods
      .getSalesVolume(1, 20)
      .call({ from: address })
      .then((result: any) => {
        setList(result);
        console.log(result);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return { loading, list };
};
