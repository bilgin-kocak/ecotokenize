import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Layout from '../components/layout';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useRouter } from 'next/router';
import { MetaMaskProvider } from 'metamask-react';
import Meta from '../components/Meta';
import UserContext from '../components/UserContext';
import { useRef } from 'react';
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  embeddedWallet,
} from '@thirdweb-dev/react';

if (typeof window !== 'undefined') {
  require('bootstrap/dist/js/bootstrap');
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pid = router.asPath;
  console.log('router', router);
  const scrollRef = useRef({
    scrollPos: 0,
  });

  const AreonTestnet = {
    chain: 'TAREA',
    chainId: 462,
    explorers: [
      {
        name: 'areonscan',
        url: 'https://areonscan.com/',
        standard: 'EIP3091',
      },
    ],
    faucets: [],
    features: [
      {
        name: 'EIP155',
      },
      {
        name: 'EIP1559',
      },
    ],
    icon: {
      url: 'https://docs.areon.network/AreonLogo.svg',
      width: 121,
      height: 191,
      format: 'svg',
    },
    infoURL: 'https://ethereum.org',
    name: 'Areon Testnet',
    nativeCurrency: {
      name: 'Test AREA',
      symbol: 'TAREA',
      decimals: 18,
    },
    networkId: 462,
    redFlags: [],
    rpc: ['https://testnet-rpc.areon.network'],
    shortName: 'tarea',
    slip44: 60,
    slug: 'tarea',
    testnet: true,
  };

  return (
    <>
      <Meta title="Home 1" />

      <Provider store={store}>
        <ThemeProvider enableSystem={true} attribute="class">
          <MetaMaskProvider>
            <ThirdwebProvider
              clientId="697a7a384ae2d203b5b7f321d1441087"
              activeChain={AreonTestnet}
              // locale={en()}
              supportedWallets={[
                metamaskWallet({ recommended: true }),
                coinbaseWallet(),
                walletConnect(),
                embeddedWallet({
                  auth: {
                    options: ['email', 'google', 'apple', 'facebook'],
                  },
                }),
              ]}
            >
              {/* <ConnectWallet theme={'dark'} modalSize={'wide'} /> */}

              <UserContext.Provider value={{ scrollRef: scrollRef }}>
                {pid === '/login' ? (
                  <Component {...pageProps} />
                ) : (
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                )}
              </UserContext.Provider>
            </ThirdwebProvider>
          </MetaMaskProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
