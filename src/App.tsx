import { WagmiConfig, createClient, Chain, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { ThemeProvider } from '@totejs/uikit';
import { bscTestnet } from 'wagmi/chains';
import Layout from './components/layout/Index';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Resource from './pages/Resource';
import Folder from './pages/Folder';
import { theme } from './theme';
import { Route, Routes, HashRouter } from 'react-router-dom';
import { ModalProvider } from './context/modal';
import { GlobalProvider } from './context/global';
import { WalletModalProvider } from './context/walletModal';

import './base/global.css';

import * as env from './env';

import RouteGuard from './router/index';

export interface IRoute {
  children?: Array<IRoute>;
  element?: React.ReactNode;
  index?: boolean;
  path?: string;
}

declare global {
  interface Window {
    trustWallet?: any;
  }
}

const routes: Array<IRoute> = [
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
  {
    path: '/folder',
    element: <Folder></Folder>,
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
  [bscTestnet, gfChain],
  [publicProvider()],
);

function App() {
  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Trust Wallet',
          shimDisconnect: true,
          getProvider: () => {
            try {
              if (
                typeof window !== 'undefined' &&
                typeof window?.trustWallet !== 'undefined'
              ) {
                // window.ethereum = window?.trustWallet;
                // eslint-disable-next-line
                Object.defineProperty(window.trustWallet, 'removeListener', {
                  value: window.trustWallet.off,
                });
                return window?.trustWallet;
              } else {
                return null;
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log(e);
            }
          },
        },
      }),
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
  return (
    <WagmiConfig client={client}>
      <ThemeProvider theme={theme}>
        <GlobalProvider>
          <ModalProvider>
            <WalletModalProvider>
              <HashRouter>
                <Layout>
                  <Routes>
                    {routes.map((item: IRoute) => {
                      return (
                        <Route
                          key={item.path}
                          path={item.path}
                          element={<RouteGuard>{item.element}</RouteGuard>}
                        />
                      );
                    })}
                  </Routes>
                </Layout>
              </HashRouter>
            </WalletModalProvider>
          </ModalProvider>
        </GlobalProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;
