import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { GroupHubContract } from '../base/contract/groupHub';
import { MARKETPLACE_CONTRACT_ADDRESS } from '../env';

export const useApprove = () => {
  const { address } = useAccount();

  const Approve = useCallback(() => {
    const approveKey = `approve_${address}`;
    const approveStatus = localStorage.getItem(approveKey);
    if (approveStatus === '1') {
      return Promise.resolve(1);
    } else {
      return new Promise((res, rej) => {
        GroupHubContract()
          .methods.grant(MARKETPLACE_CONTRACT_ADDRESS, 4, 0xffffffff)
          .send({ from: address })
          .then((result: any) => {
            console.log(result, '-----Approve result');
            localStorage.setItem(approveKey, '1');
            res(result);
          })
          .catch((err: any) => {
            rej(err);
          });
      });
    }
  }, [address]);

  return {
    Approve,
  };
};
