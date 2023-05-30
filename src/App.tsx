import { WagmiConfig, createClient, Chain, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { ThemeProvider } from '@totejs/uikit';
import { bscTestnet } from 'wagmi/chains';
import { ConnectKitProvider } from 'connectkit';
import Layout from './components/layout';

import { theme } from './theme';

import * as env from './env';


const opChain: Chain = {
  id: 91715,
  network: 'Combo Testnet',
  rpcUrls: {
    default: {
      http: [env.L2_RPC_URL],
    },
    public: {
      http: [env.L2_RPC_URL],
    },
  },
  name: 'Combo Testnet',
  nativeCurrency: {
    name: 'tcBNB',
    symbol: 'tcBNB',
    decimals: 18,
  },
};

const { chains, provider } = configureChains([bscTestnet, opChain], [publicProvider()]);

function App() {

  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'ComboScan',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: '...',
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    logger: {
      warn: (message: string) => console.log(message),
    },
  });

  const colors = theme.colors.light;
  return (
    <WagmiConfig client={client}>
      <ThemeProvider theme={theme}>
        <ConnectKitProvider
          customTheme={{
            '--ck-connectbutton-background': colors.scene.primary.normal,
            '--ck-connectbutton-font-size': '12px',
            '--ck-connectbutton-hover-background': colors.scene.primary.active,
            '--ck-connectbutton-border-radius': '8px',
          }}
        >
          <Layout>
          </Layout>
        </ConnectKitProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;
