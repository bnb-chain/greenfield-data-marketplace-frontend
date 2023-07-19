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
import { OwnContract } from '../base/contract/ownContract';

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

        const count = 180;
        if (BscBalanceVal >= n) {
          let tmp = {};
          try {
            await MarketPlaceContract().methods.buy(groupId, address).send({
              from: address,
              value: totalFee,
              gasPrice: BSC_SEND_GAS_FEE,
            });

            const t = new Array(count).fill(1);

            let success = false;
            for (const {} of t) {
              const hasOwn = Number(
                await OwnContract(false)
                  .methods.balanceOf(address, Number(groupId))
                  .call(),
              );
              if (hasOwn > 0) {
                success = true;
                break;
              }
              await delay(1);
            }

            tmp = {
              variant: 'success',
              description: success ? 'Buy successful' : 'pending',
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
