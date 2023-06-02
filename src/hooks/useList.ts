import { CreateGroup } from '@/utils/gfSDK';
import { ISimulateGasFee } from '@bnb-chain/greenfield-chain-sdk';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

export const useList = () => {
  const { address } = useAccount();
  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee>();

  let broadcastFn: any;

  const Simulate = useCallback(async (bucketName: string) => {
    const { simulate, broadcast } = await CreateGroup({
      creator: address as string,
      groupName: bucketName,
      members: [],
    });

    broadcastFn = broadcast;

    const simulateInfo = await simulate({
      denom: 'BNB',
    });

    setSimulateInfo(simulateInfo);

    console.log(simulateInfo);
  }, []);

  const List = useCallback(async () => {
    const { gasLimit, gasPrice } = simulateInfo as ISimulateGasFee;
    await broadcastFn({
      denom: 'BNB',
      gasLimit: Number(gasLimit),
      gasPrice: gasPrice,
      payer: address,
      granter: '',
    });
  }, []);

  return {
    simulateInfo,
    List,
    Simulate,
  };
};
