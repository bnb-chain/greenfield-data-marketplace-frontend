import { WagmiConfig, createClient, Chain, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
// import { InjectedConnector } from 'wagmi/connectors/injected';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { ThemeProvider } from '@totejs/uikit';
import { bscTestnet } from 'wagmi/chains';
import { ConnectKitProvider } from 'connectkit';
import Layout from './components/layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Collection from './pages/Collection';
import { theme } from './theme';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import * as env from './env';

const router = createHashRouter([
  {
    path: '/',
    element: <Home></Home>,
  },
  {
    path: '/profile',
    element: <Profile></Profile>,
  },
  {
    path: '/collection',
    element: <Collection></Collection>,
  },
]);

const gfChain: Chain = {
  id: 9000,
  network: 'greenfield',
  rpcUrls: {
    default: {
      http: [env.GF_RPC_URL],
    },
    public: {
      http: [env.GF_RPC_URL],
    },
  },
  name: 'Greenfield Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
};

const { chains, provider } = configureChains(
  [bscTestnet, gfChain],
  [publicProvider()],
);

function App() {
  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      // new CoinbaseWalletConnector({
      //   chains,
      //   options: {
      //     appName: 'ComboScan',
      //   },
      // }),
      // new WalletConnectConnector({
      //   chains,
      //   options: {
      //     projectId: '...',
      //   },
      // }),
      // new InjectedConnector({
      //   chains,
      //   options: {
      //     name: 'Injected',
      //     shimDisconnect: true,
      //   },
      // }),
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
            <RouterProvider router={router} />
          </Layout>
        </ConnectKitProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;
