import {
  CreateGroup,
  getCollectionInfoByName,
  mirrorGroup,
} from '../utils/gfSDK';
import { ISimulateGasFee } from '@bnb-chain/greenfield-chain-sdk';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { GroupHubContract } from '../base/contract/groupHub';
import { MARKETPLACE_CONTRACT_ADDRESS } from '../env';

import { MarketPlaceContract } from '../base/contract/marketPlaceContract';

export const useList = () => {
  const [simulateGroupInfo, setSimulateGroupInfo] = useState<ISimulateGasFee>();

  const { address, connector } = useAccount();

  const GenGroup = useCallback(
    async (obj: { groupName: string; extra: string }) => {
      const { groupName, extra } = obj;
      console.log(
        {
          creator: address as string,
          groupName: groupName,
          members: [address as string],
          extra,
        },
        '------crateGroupInfo',
      );
      const { simulate, broadcast } = await CreateGroup({
        creator: address as string,
        groupName: groupName,
        members: [address as string],
        extra,
      });
      const simulateGroupInfo = await simulate({
        denom: 'BNB',
      });
      setSimulateGroupInfo(simulateGroupInfo);
      console.log(simulateGroupInfo, '-------simulateGroupInfo');
      const res = await broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateGroupInfo.gasLimit) * 2,
        gasPrice: simulateGroupInfo.gasPrice,
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
        console.log(res, '-----create group result');
        alert('create group success');
      }
      return res;
    },
    [connector],
  );

  const Mirror = useCallback(
    async (obj: { groupName: string; extra: string }) => {
      const { groupName } = obj;
      const { groupInfo } = await getCollectionInfoByName(
        groupName,
        address as string,
      );
      console.log(groupInfo, '-----group info on chain');

      if (!groupInfo) return;

      const mirrorGroupTx = await mirrorGroup(groupInfo.id, address as string);

      const simulateInfo = await mirrorGroupTx.simulate({
        denom: 'BNB',
      });

      console.log(simulateInfo, '-----mirrorGroup simulateInfo');

      const res = await mirrorGroupTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
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

      if (res.code === 0) {
        console.log(res, '-----mirrorGroup result');
        alert('mirror group success');
      }
      return res;
    },
    [connector],
  );

  const Approve = useCallback(() => {
    const approveStatus = localStorage.getItem('approve');
    if (approveStatus === '1') {
      return Promise.resolve(1);
    } else {
      return new Promise((res, rej) => {
        GroupHubContract()
          .methods.grant(MARKETPLACE_CONTRACT_ADDRESS, 4, 0xffffffff)
          .send({ from: address })
          .then((result: any) => {
            console.log(result, '-----Approve result');
            localStorage.setItem('approve', '1');
            res(result);
          })
          .catch((err: any) => {
            rej(err);
          });
      });
    }
  }, []);

  const List = useCallback(
    async (obj: { groupName: string; extra: string }) => {
      const { groupName } = obj;
      const { groupInfo } = await getCollectionInfoByName(
        groupName,
        address as string,
      );

      if (!groupInfo) return;
      const { id } = groupInfo;
      let { extra } = groupInfo as any;
      extra = JSON.parse(extra);
      const { price } = extra;

      return await new Promise((res, rej) => {
        MarketPlaceContract()
          .methods.list(id, price)
          .send({ from: address })
          .then((result: any) => {
            console.log(result, '-----list result');
            res(result);
          })
          .catch((err: any) => {
            rej(err);
          });
      });
    },
    [],
  );

  return {
    simulateGroupInfo,
    GenGroup,
    Mirror,
    List,
    Approve,
  };
};
