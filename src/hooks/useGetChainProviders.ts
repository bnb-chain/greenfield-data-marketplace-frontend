import { useProvider } from 'wagmi';
import * as env from '@/env';

export const useGetChainProviders = () => {
  const provider = useProvider();
  const chainsInfo = provider.chains;

  const l1Chain = chainsInfo?.filter((chain: any) => {
    return chain.id === env.L1_CHAIN_ID;
  });

  const l2Chain = chainsInfo?.filter((chain: any) => {
    return chain.id === env.L2_CHAIN_ID;
  });

  return {
    l1Chain,
    l2Chain,
  };
};
