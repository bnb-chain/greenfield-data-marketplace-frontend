import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { GroupHubContract } from '../base/contract/groupHub';
import { BSC_SEND_GAS_FEE, MARKETPLACE_CONTRACT_ADDRESS } from '../env';

export const useRevoke = () => {
  const { address } = useAccount();
  const revoke = useCallback(async () => {
    const result = await GroupHubContract()
      .methods.revoke(MARKETPLACE_CONTRACT_ADDRESS, 4)
      .send({ from: address, gasPrice: BSC_SEND_GAS_FEE });

    if (result.status) {
      return true;
    } else {
      return false;
    }

    return result;
  }, [address]);

  return { revoke };
};
