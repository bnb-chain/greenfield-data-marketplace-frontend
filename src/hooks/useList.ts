import {
  CreateGroup,
  getGroupInfoByName,
  mirrorGroup,
  multiTx,
} from '../utils/gfSDK';
import { ISimulateGasFee } from '@bnb-chain/greenfield-chain-sdk';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { useModal } from './useModal';
import { getRandomStr } from '../utils';

export const useList = () => {
  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee>();

  const { address, connector } = useAccount();

  const stateModal = useModal();

  const InitiateList = useCallback(
    async (obj: { groupName: string; extra: string }) => {
      console.log(obj, '----InitiateList params');

      // setTimeout(() => {
      //   stateModal.modalDispatch({
      //     type: 'UPDATE_LIST_STATUS',
      //     initListStatus: 1,
      //     initListResult: {},
      //   });
      // }, 3000);
      const { groupName } = obj;
      const groupResult = await getGroupInfoByName(
        groupName,
        address as string,
      );
      const { groupInfo } = groupResult;
      console.log(groupInfo, groupResult, '------groupInfo');
      // groupname has created
      if (groupInfo) {
        // obj.groupName = `${groupName}-${getRandomStr(6)}`;
        stateModal.modalDispatch({
          type: 'UPDATE_LIST_STATUS',
          initListStatus: 1,
          initListResult: {},
          // listData: Object.assign(stateModal.modalState.listData, {
          //   groupName: `${groupName}-${getRandomStr(6)}`,
          //   extra: obj.extra,
          // }),
        });
        return;
      }
      let tmp = {};
      try {
        const { groupName, extra } = obj;

        const createGroupTx = await CreateGroup({
          creator: address as string,
          groupName: groupName,
          members: [address as string],
          extra,
        });

        const mirrorGroupTx = await mirrorGroup(
          groupName,
          '0',
          address as string,
        );

        const { simulate, broadcast } = await multiTx([
          createGroupTx,
          mirrorGroupTx,
        ]);

        const simulateMultiTxInfo = await simulate({
          denom: 'BNB',
        });

        setSimulateInfo(simulateMultiTxInfo);

        console.log(simulateMultiTxInfo, '-------simulateMultiTxInfo');

        const res = await broadcast({
          denom: 'BNB',
          gasLimit: Number(simulateMultiTxInfo.gasLimit) * 2,
          gasPrice: simulateMultiTxInfo.gasPrice,
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
          console.log(res, '-----InitiateList result');
          stateModal.modalDispatch({
            type: 'UPDATE_LIST_STATUS',
            initListStatus: 1,
            initListResult: res,
          });
        } else {
          tmp = {
            variant: 'error',
            description: 'Mirror failed',
          };
        }
        return res;
      } catch (e: any) {
        console.log(e, '----InitiateList Error');
        tmp = {
          variant: 'error',
          description: e.message ? e.message : 'Mirror failed',
        };
      }
      stateModal.modalDispatch({
        type: 'OPEN_RESULT',
        result: tmp,
      });
    },
    [connector],
  );

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
      setSimulateInfo(simulateGroupInfo);
      console.log(simulateGroupInfo, '-------simulateGroupInfo');
      const res = await broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateGroupInfo.gasLimit),
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
      const { groupInfo } = await getGroupInfoByName(
        groupName,
        address as string,
      );
      console.log(groupInfo, '-----group info on chain');

      if (!groupInfo) return;

      const mirrorGroupTx = await mirrorGroup(
        groupName,
        groupInfo.id,
        address as string,
      );

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

  const List = useCallback(
    async (obj: { groupName: string; extra: string }) => {
      const { groupName } = obj;
      const { groupInfo } = await getGroupInfoByName(
        groupName,
        address as string,
      );

      if (!groupInfo) return;
      const { id } = groupInfo;
      let { extra } = groupInfo as any;
      extra = JSON.parse(extra);
      const { price } = extra;
      console.log(id, price, '-------list info');
      const result = await MarketPlaceContract()
        .methods.list(id, price)
        .send({ from: address });

      console.log(result, '-----list result');
      return result;
    },
    [],
  );

  return {
    InitiateList,
    simulateInfo,
    GenGroup,
    Mirror,
    List,
  };
};
