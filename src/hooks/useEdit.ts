import {
  CreateGroup,
  getGroupInfoByName,
  mirrorGroup,
  multiTx,
  updateGroupInfo,
} from '../utils/gfSDK';
import { ISimulateGasFee } from '@bnb-chain/greenfield-chain-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export const useEdit = (address: string, groupName: string, extra: string) => {
  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee>();

  const { connector } = useAccount();

  const Init = useCallback(
    async (address: string, groupName: string, extra: string) => {
      console.log(
        {
          operator: address,
          groupOwner: address,
          groupName,
          Extra: extra,
        },
        '------edit info',
      );
      const { simulate, broadcast } = await updateGroupInfo(
        address,
        groupName,
        extra,
      );
      const simulateEditInfo = await simulate({
        denom: 'BNB',
      });
      setSimulateInfo(simulateEditInfo);
      console.log(simulateEditInfo, '-------simulateEditInfo');
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
          console.log(connector);
          const provider = await connector?.getProvider();
          return await provider?.request({
            method: 'eth_signTypedData_v4',
            params: [addr, message],
          });
        },
      });

      if (res.code === 0) {
        console.log(res, '-----edit group result');
      }
      return res;
    },
    [connector],
  );

  return {
    edit,
    simulateInfo,
  };
};
