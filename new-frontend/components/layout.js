import Footer from './footer';
import Wallet_modal from './modal/wallet_modal';
import BidsModal from './modal/bidsModal';
import BuyModal from './modal/buyModal';
import SellModal from './modal/sellModal';
import { useRouter } from 'next/router';
import Header01 from './header/Header01';
export default function Layout({ children }) {
  const route = useRouter();
  // header start
  let header;

  header = <Header01 />;

  // header end

  return (
    <>
      {header}
      <Wallet_modal />
      <BidsModal />
      <BuyModal />
      <SellModal />
      <main>{children}</main>
      <Footer />
    </>
  );
}
