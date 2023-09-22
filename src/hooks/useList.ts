import {
  CreateGroup,
  getGroupInfoByName,
  mirrorGroup,
  multiTx,
  putBucketPolicy,
  putObjectPolicy,
} from '../utils/gfSDK';
import {
  ISimulateGasFee,
  PermissionTypes,
  GRNToString,
  newGroupGRN,
  newObjectGRN,
} from '@bnb-chain/greenfield-js-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import { useModal } from './useModal';
import { delay, parseGroupName } from '../utils';
import { BSC_SEND_GAS_FEE } from '../env';
import { OwnBuyContract } from '../base/contract/ownBuyContract';
import { IHeadGroup } from '../utils/type';

export interface IList {
  groupName: string;
  extra: string;
}
export const useList = (props: IList) => {
  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee>();
  const [loading, setLoading] = useState(false);
  const { address, connector } = useAccount();

  const stateModal = useModal();
  const { groupName, extra } = props;
  const simulateTx = useCallback(
    async (changeLoading = true) => {
      if (!address || !groupName) return {};
      try {
        changeLoading && setLoading(true);
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

        let policyTx;
        const { name, bucketName, type } = parseGroupName(groupName);
        const statement: PermissionTypes.Statement = {
          effect: PermissionTypes.Effect.EFFECT_ALLOW,
          actions: [PermissionTypes.ActionType.ACTION_GET_OBJECT],
          resources:
            type === 'Data' ? [] : [GRNToString(newObjectGRN(bucketName, '*'))],
        };

        const principal = {
          type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_GROUP,
          value: GRNToString(newGroupGRN(address as string, groupName)),
        };
        if (type === 'Collection') {
          policyTx = await putBucketPolicy(bucketName, {
            operator: address,
            statements: [statement],
            principal,
          });
        } else {
          policyTx = await putObjectPolicy(bucketName, name, {
            operator: address,
            statements: [statement],
            principal,
          });
        }

        const { simulate, broadcast } = await multiTx([
          createGroupTx,
          mirrorGroupTx,
          policyTx,
        ]);

        const simulateMultiTxInfo = await simulate({
          denom: 'BNB',
        });

        setSimulateInfo(simulateMultiTxInfo);
        setLoading(false);
        return { simulate, broadcast, simulateMultiTxInfo };
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
      return {};
    },
    [groupName, extra, address],
  );
  const getGroupInfo = useCallback(
    async (groupName: string, address: string): Promise<IHeadGroup> => {
      const result = await getGroupInfoByName(groupName, address);
      return result;
    },
    [],
  );
  const InitiateList = useCallback(async () => {
    const groupResult = await getGroupInfo(groupName, address as string);
    const { groupInfo } = groupResult;
    // groupname has created
    if (groupInfo) {
      setTimeout(() => {
        stateModal.modalDispatch({
          type: 'UPDATE_LIST_STATUS',
          initListStatus: 1,
          initListResult: {},
        });
      }, 500);
      return;
    }
    let tmp = {};
    try {
      const { broadcast, simulateMultiTxInfo } = await simulateTx(false);
      const res = await broadcast?.({
        denom: 'BNB',
        gasLimit: Number(simulateMultiTxInfo.gasLimit) * 2,
        gasPrice: simulateMultiTxInfo.gasPrice,
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
      const count = 60;
      const t = new Array(count).fill(1);
      let hasMirror = false;
      let groupId;
      for (const {} of t) {
        if (!groupId) {
          const groupResult = await getGroupInfo(groupName, address as string);
          groupId = groupResult?.groupInfo?.id;
        }
        hasMirror = await OwnBuyContract(false)
          .methods.exists(Number(groupId))
          .call({ from: address });
        if (hasMirror) {
          break;
        }
        await delay(1);
      }

      if (res?.code === 0 && hasMirror) {
        stateModal.modalDispatch({
          type: 'UPDATE_LIST_STATUS',
          initListStatus: 1,
          initListResult: res,
        });
      } else {
        tmp = {
          variant: res?.code !== 0 ? 'error' : 'success',
          description: res?.code !== 0 ? 'Mirror failed' : 'Mirror pending',
        };
      }
      return res;
    } catch (e: any) {
      tmp = {
        variant: 'error',
        description: e.message ? e.message : 'Mirror failed',
      };
    }
    stateModal.modalDispatch({
      type: 'OPEN_RESULT',
      result: tmp,
    });
  }, [connector, groupName, extra, address]);

  const List = useCallback(
    async (obj: IList) => {
      const { groupName } = obj;
      const groupResult = await getGroupInfo(groupName, address as string);
      const { groupInfo } = groupResult;
      if (!groupInfo) return;
      const { id } = groupInfo;
      let { extra } = groupInfo as any;
      extra = JSON.parse(extra);
      const { price } = extra;
      const result = await MarketPlaceContract()
        .methods.list(id, price)
        .send({ from: address, gasPrice: BSC_SEND_GAS_FEE });

      return result;
    },
    [connector, address],
  );

  useEffect(() => {
    simulateTx();
  }, [props]);

  return {
    InitiateList,
    simulateInfo,
    List,
    loading,
  };
};
