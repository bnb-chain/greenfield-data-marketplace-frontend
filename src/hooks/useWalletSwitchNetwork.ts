import { useSwitchNetwork } from 'wagmi';

import { handleWalletError } from '../base/error/handleWalletError';

export type UseWalletSwitchNetworkParams = Parameters<
  typeof useSwitchNetwork
>[0];

export function useWalletSwitchNetWork(params?: UseWalletSwitchNetworkParams) {
  return useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
    onError: handleWalletError,
    ...params,
  });
}
