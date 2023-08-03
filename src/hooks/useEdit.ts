import { updateGroupInfo } from '../utils/gfSDK';
import { ISimulateGasFee } from '@bnb-chain/greenfield-js-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export const useEdit = (address: string, groupName: string, extra: string) => {
  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee>();
  const [simLoading, setSimLoading] = useState(false);

  const { connector } = useAccount();

  const Init = useCallback(
    async (address: string, groupName: string, extra: string) => {
      try {
        setSimLoading(true);
        const { simulate } = await updateGroupInfo(address, groupName, extra);
        const simulateEditInfo = await simulate({
          denom: 'BNB',
        });
        setSimulateInfo(simulateEditInfo);
      } catch (e) {
        console.log(e);
      }
      setSimLoading(false);
    },
    [address, groupName, extra],
  );

  useEffect(() => {
    if (address && groupName && extra) {
      Init(address, groupName, extra);
    }
  }, [address, groupName, extra]);

  const edit = useCallback(
    async (address: string, groupName: string, extra: string) => {
      const { simulate, broadcast } = await updateGroupInfo(
        address,
        groupName,
        extra,
      );
      const simulateEditInfo = await simulate({
        denom: 'BNB',
      });

      const res = await broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateEditInfo?.gasLimit),
        gasPrice: simulateEditInfo?.gasPrice,
        payer: address as string,
        granter: '',
        signTypedDataCallback: async (addr: string, message: string) => {
          const provider = await connector?.getProvider();
          return await provider?.request({
            method: 'eth_signTypedData_v4',
            params: [addr, message],
          });
        },
      });

      return res;
    },
    [connector],
  );

  return {
    edit,
    simulateInfo,
    simLoading,
  };
};
