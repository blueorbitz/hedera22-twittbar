import { useState, useEffect } from 'react'
import { Hbar } from '@hashgraph/sdk'
import axios from "axios"

export default function AppHeader() {
  const [accountBalance, setAccountbalance] = useState('0 ℏ');

  useEffect(() => {
    async function fetchData() {
      if (window.hedera === true)
        return;

      const accountInfoUrl = 'https://testnet.mirrornode.hedera.com/api/v1/accounts/';
      const resp = await axios.get(accountInfoUrl + window.hedera.account.id.toString());
      const balance = resp.data.balance.balance;
      setAccountbalance(Hbar.fromTinybars(balance).toString());
      console.log('Load account balance', accountBalance); 
    }
    fetchData();
  }, []);

  const onLogout = async () => {
    const data = await axios.get('/api/hello');
    console.log(data);
  }

  return (
    <header>
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <a href="/" className="d-flex align-items-center text-dark text-decoration-none">
          <span className="fs-4">Home</span>
        </a>
        <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
          <span className="py-2 me-3 text-dark text-decoration-none">Account balance: {accountBalance}</span>
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