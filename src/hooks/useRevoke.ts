// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';

import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import { GroupHubContract } from '../base/contract/groupHub';
import { MARKETPLACE_CONTRACT_ADDRESS } from '../env';

export const useRevoke = () => {
  const { address } = useAccount();
  const revoke = useCallback(async () => {
    const result = await GroupHubContract()
      .methods.revoke(MARKETPLACE_CONTRACT_ADDRESS, 4)
      .send({ from: address });

    console.log(result, '-----revoke');
    if (result.status) {
      return true;
    } else {
      return false;
    }

    return result;
  }, [address]);

  return { revoke };
};
