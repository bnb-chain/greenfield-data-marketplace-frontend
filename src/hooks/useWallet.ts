import { useState } from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';

import { useWalletSwitchNetWork } from './useWalletSwitchNetwork';
import { handleWalletError } from '../base/error/handleWalletError';

export interface UseWalletProps {
  chainId?: number;
  onSuccess?: (address?: string) => void;
  onConnectError?: (err: Error, args: any, context: unknown) => void;
  onSwitchNetworkError?: (err: Error, args: any, context: unknown) => void;
}

export function useWallet(props: UseWalletProps) {
  const { onSuccess, onConnectError, onSwitchNetworkError, chainId } = props;

  const { disconnectAsync, disconnect } = useDisconnect();
  const { isConnecting, isConnected } = useAccount();

  const [connector, setConnector] = useState<Connector>();
  const [address, setAddress] = useState<string>();

  const { connect, connectors } = useConnect({
    onError: (...params) => {
      handleWalletError(...params);
      onConnectError?.(...params);
    },
    onSuccess: (data) => {
      setAddress(data.account);

      if (data.chain.id === chainId) {
        onSuccess?.(data.account);
      } else {
        switchNetwork?.(chainId);
      }
    },
  });

  const { switchNetwork, isLoading } = useWalletSwitchNetWork({
    onError: (...params) => {
      handleWalletError(...params);
      onSwitchNetworkError?.(...params);
    },
    onSuccess: () => {
      onSuccess?.(address);
    },
  });

  const onChangeConnector = (connector: Connector) => {
    console.log(connector);

    disconnectAsync().then(() => {
      setAddress('');
    });

    setTimeout(() => {
      setConnector(connector);
      connect({
        connector,
      });
    }, 200);
  };

  return {
    isLoading: (isConnecting && !isConnected) || isLoading,
    connector,
    connectors,
    onChangeConnector,
    disconnect,
  };
}
