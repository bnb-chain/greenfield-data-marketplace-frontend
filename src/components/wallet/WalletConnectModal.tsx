import {
  Link,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Modal,
} from '@totejs/uikit';
import { useCallback, useEffect } from 'react';
import { ConnectorNotFoundError } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { WalletItem } from './WalletItem';
import { MetamaskIcon } from '../svgIcon/MetamaskIcon';
import { TrustWalletIcon } from '../svgIcon/TrustWalletIcon';
import { useWallet } from '../../hooks/useWallet';
import { useWalletModal } from '../../hooks/useWalletModal';
import { BSC_CHAIN_ID } from '../../env';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectModal(props: WalletConnectModalProps) {
  const { isOpen, onClose } = props;

  const chainId = BSC_CHAIN_ID;
  const { handleModalClose } = useWalletModal();

  const onConnectError = useCallback((err: Error, args: any) => {
    if (err instanceof ConnectorNotFoundError) {
      const { connector } = args;

      if (connector instanceof MetaMaskConnector) {
        window.open('https://metamask.io/download/', '_blank');
      } else if (
        connector instanceof InjectedConnector &&
        connector.name === 'Trust Wallet'
      ) {
        window.open('https://trustwallet.com/browser-extension', '_blank');
      }
    }
  }, []);

  const onSuccess = useCallback(() => {
    handleModalClose();
  }, [handleModalClose]);

  const {
    isLoading: isWalletConnecting,
    connectors,
    connector,
    onChangeConnector,
    disconnect,
  } = useWallet({
    chainId: chainId,
    onSuccess,
    onConnectError,
  });

  const isLoading = isWalletConnecting;

  useEffect(() => {
    if (isOpen) {
      disconnect();
    }
  }, [disconnect, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      w={484}
      background={'readable.white'}
      color={'readable.normal'}
    >
      <ModalCloseButton _hover={{ background: 'bg.walletTab' }} />
      <ModalHeader color={'bg.middle'}>Connect a Wallet</ModalHeader>
      <ModalBody mt={34} background={'readable.white'}>
        {connectors?.map((item: any, index: number) => {
          const options = getOptionsByWalletName(item.name);
          const isActive = isLoading && connector?.name === item.name;

          return (
            <WalletItem
              key={index}
              icon={options?.icon}
              name={item.name}
              isActive={isActive}
              isDisabled={isLoading}
              onClick={() => {
                onChangeConnector(item);
              }}
            />
          );
        })}
      </ModalBody>

      <ModalFooter
        mt={40}
        fontSize={14}
        fontWeight={400}
        lineHeight="17px"
        color="bg.middle"
        gap={4}
      >
        Don't have a wallet?
        <Link
          href={'https://trustwallet.com/browser-extension'}
          isExternal
          color="inherit"
          textDecoration="underline"
        >
          Get one here!
        </Link>
      </ModalFooter>
    </Modal>
  );
}

function getOptionsByWalletName(walletName: string) {
  switch (walletName) {
    case 'MetaMask':
      return {
        icon: <MetamaskIcon width={52} height={52} />,
      };
    case 'Trust Wallet':
      return {
        icon: <TrustWalletIcon width={52} height={52} />,
      };
    default:
      return null;
  }
}
