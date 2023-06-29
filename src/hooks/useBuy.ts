import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useStatus } from './useStatus';
import { useChainBalance } from './useChainBalance';
import { MarketPlaceContract } from '../base/contract/marketPlaceContract';
import BN from 'bn.js';
import { useRelayFee } from './useRelayFee';
import { delay, divide10Exp } from '../utils';
import { useModal } from './useModal';
import { useNavigate } from 'react-router-dom';
import { BSC_SEND_GAS_FEE } from '../env';

export const useBuy = (
  groupName: string,
  groupOwner: string,
  price: string,
) => {
  // 0 owner
  // 1 purchase
  // 2 Waiting for purchase
  const { address } = useAccount();
  const { BscBalanceVal } = useChainBalance();
  const { status } = useStatus(groupName, groupOwner, address as string);

  const { relayFee } = useRelayFee();

  const state = useModal();

  const navigator = useNavigate();

  const buy = useCallback(
    async (groupId: number) => {
      if (status === 1) {
        const totalFee = new BN(price, 10).add(new BN(relayFee, 10));
        const n = Number(divide10Exp(totalFee, 18));

        if (BscBalanceVal >= n) {
          let tmp = {};
          try {
            const contract = MarketPlaceContract();
            const result = await contract.methods.buy(groupId, address).send({
              from: address,
              value: totalFee,
              gasPrice: BSC_SEND_GAS_FEE,
            });
            await delay(10);

            const { status, transactionHash } = result as any;
            const success = status && transactionHash;
            tmp = {
              variant: success ? 'success' : 'error',
              description: success ? 'Buy successful' : 'Buy failed',
              callBack: () => {
                navigator('/profile?tab=purchase');
              },
            };
          } catch (e: any) {
            tmp = {
              variant: 'error',
              description: e.message ? e.message : 'Buy failed',
            };
          }
          state.modalDispatch({
            type: 'OPEN_RESULT',
            result: tmp,
          });
        } else {
          return false;
        }
      }
      return false;
    },
    [status, BscBalanceVal, price, relayFee],
  );
  return { buy, relayFee };
};
