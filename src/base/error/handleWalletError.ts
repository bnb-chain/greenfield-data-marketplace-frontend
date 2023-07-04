import { toast } from '@totejs/uikit';
import { ConnectorNotFoundError } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { ErrorMsgMap } from './error';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleWalletError(err: any, args: any, context: unknown) {
  let text = '';

  switch (true) {
    case err instanceof ConnectorNotFoundError:
      const { connector } = args;
      if (connector instanceof MetaMaskConnector) {
        text = `Metamask not installed. Please install and reconnect.`;
      } else if (
        connector instanceof InjectedConnector &&
        connector.name === 'Trust Wallet'
      ) {
        text = `Trust wallet not installed. Please install and reconnect.`;
      } else {
        text = `Wallet not installed. Please install and reconnect.`;
      }
      break;
  }

  const code = err.cause?.code ?? err.code;
  const message = err.cause?.message ?? err.message;
  const description = text || ErrorMsgMap[code] || message;

  toast.error({
    description,
  });
}
