// import { useCallback, useState, useEffect } from 'react';
// import { useGetChainProviders } from './useGetChainProviders';
import Web3 from 'web3';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { MARKETPLACE_CONTRACT_ADDRESS } from '../env';
import { GroupHubContract } from '../base/contract/groupHub';

export const useHasRole = () => {
  const { address } = useAccount();
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    if (address) {
      GroupHubContract(false)
        .methods.hasRole(
          Web3.utils.keccak256('ROLE_UPDATE'),
          address,
          MARKETPLACE_CONTRACT_ADDRESS,
        )
        .call({ from: address })
        .then((result: any) => {
          setHasRole(result);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [address]);

  return { hasRole, setHasRole };
};
