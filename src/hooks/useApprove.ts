import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { GroupHubContract } from '../base/contract/groupHub';
import { MARKETPLACE_CONTRACT_ADDRESS } from '../env';

export const useApprove = () => {
  const { address } = useAccount();

  const Approve = useCallback(() => {
    if (!address) return Promise.reject(false);
    return new Promise((res, rej) => {
      GroupHubContract()
        .methods.grant(MARKETPLACE_CONTRACT_ADDRESS, 4, 0xffffffff)
        .send({ from: address })
        .then((result: any) => {
          console.log(result, '-----Approve result');
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
