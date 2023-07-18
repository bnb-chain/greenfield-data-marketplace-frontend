import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { GroupHubContract } from '../base/contract/groupHub';
import { BSC_SEND_GAS_FEE, MARKETPLACE_CONTRACT_ADDRESS } from '../env';

export const useApprove = () => {
  const { address } = useAccount();

  const Approve = useCallback(async () => {
    if (!address) return Promise.reject(false);
    return new Promise((res, rej) => {
      GroupHubContract()
        .methods.grant(MARKETPLACE_CONTRACT_ADDRESS, 4, 0xffffffff)
        .send({ from: address, gasPrice: BSC_SEND_GAS_FEE })
        .then((result: any) => {
          res(result);
        })
        .catch((err: any) => {
          rej(err);
        });
    });
  }, [address]);

  return {
    Approve,
  };
};
