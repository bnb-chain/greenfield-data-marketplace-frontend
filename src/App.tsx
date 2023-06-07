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
import Resource from './pages/Resource';
import { theme } from './theme';
import { Route, Routes, HashRouter } from 'react-router-dom';

import './base/global.css';

import * as env from './env';

const routes = [
  {
    path: '/',
    element: <Home></Home>,
  },
  {
    path: '/profile',
    element: <Profile></Profile>,
  },
  {
    path: '/resource',
    element: <Resource></Resource>,
  },
];

const gfChain: Chain = {
  id: env.GF_CHAIN_ID,
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
  [gfChain, bscTestnet],
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
          theme="soft"
          customTheme={{
            '--ck-connectbutton-background': colors.scene.primary.normal,
            '--ck-connectbutton-font-size': '12px',
            '--ck-connectbutton-hover-background': colors.scene.primary.active,
            '--ck-connectbutton-border-radius': '8px',
            '--ck-primary-button-background': colors.scene.primary.opacity,
            '--ck-primary-button-box-shadow': 'none',
            '--ck-primary-button-hover-background':
              colors.scene.primary.semiOpacity,
            '--ck-primary-button-hover-box-shadow': 'none',
            '--ck-primary-button-font-weight': '600',
            '--ck-primary-button-border-radius': '8px',
            '--ck-secondary-button-background': colors.scene.primary.normal,
            '--ck-secondary-button-hover-background':
              colors.scene.primary.active,
            '--ck-secondary-button-color': colors.readable.white,
            '--ck-secondary-button-border-radius': '8px',
            '--ck-font-family': 'Inter',
            '--ck-border-radius': '8px',
            '--ck-overlay-backdrop-filter': 'blur(15px)',
            '--ck-overlay-background': 'rgba(0,0,0,0.5)',
            '--ck-focus-color': 'transparent',
            '--ck-dropdown-pending-color': 'transparent',
          }}
          options={{
            hideBalance: true,
            initialChainId: env.GF_CHAIN_ID,
          }}
        >
          <HashRouter>
            <Layout>
              <Routes>
                {routes.map((item: any) => {
                  return <Route path={item.path} element={item.element} />;
                })}
              </Routes>
            </Layout>
          </HashRouter>
        </ConnectKitProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;
