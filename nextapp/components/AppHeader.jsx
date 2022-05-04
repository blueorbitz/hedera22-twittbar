import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

export default function AppHeader() {
  const router = useRouter();
  const [accountBalance, setAccountbalance] = useState('0 ℏ');

  useEffect(() => {
    async function fetchData() {
      if (window.hedera === true)
        return;

      const wallet = await window.hedera.getAccountBalance();
      setAccountbalance(wallet.hbars.toString());
    }
    const timer = setInterval(fetchData, 1500);
    return () => setInterval(timer);
  }, []);

  const onLogout = async () => {
    if (window.hedera.constructor.name !== 'HashPackWallet')
      return;
    window.hedera.wipePairingData();
    router.push({ pathname: '/login' });
  }

  return (
    <header>
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <a href="/" className="d-flex align-items-center text-dark text-decoration-none">
          <span className="fs-4">Home <small className='text-muted'>testnet</small></span>
        </a>
        <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
          <span className="py-2 me-3 text-primary text-decoration-none">Balance {accountBalance}</span>
          <a className="py-2 text-dark text-decoration-none" href="#" onClick={onLogout}>Logout</a>
        </nav>
      </div>

      <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h1 className="display-4 fw-normal">TwittBar</h1>
        <p className="fs-5 text-muted">Vault to transfer Hbar(ℏ) via Twitter handle</p>
      </div>
    </header>
  );
}