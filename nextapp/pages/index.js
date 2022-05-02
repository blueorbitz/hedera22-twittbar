import Head from 'next/head'
import { useState, useEffect } from 'react'
import axios from "axios"
import { Hbar, TransactionId, TransactionReceipt } from '@hashgraph/sdk'
import { ToastContainer, toast } from 'react-toastify'
import styles from '../styles/Home.module.css'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  const [accountBalance, setAccountbalance] = useState('0 ℏ');

  useEffect(() => {
    async function fetchData() {
      const accountInfoUrl = 'https://testnet.mirrornode.hedera.com/api/v1/accounts/';
      const resp = await axios.get(accountInfoUrl + window.hedera.account.id.toString());
      const balance = resp.data.balance.balance;
      setAccountbalance(Hbar.fromTinybars(balance).toString());
      console.log('Load account balance', accountBalance); 
    }
    fetchData();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const username = event.target[0].value;
    const amount = parseFloat(event.target[1].value);
    console.log(`Transfering to ${username} for ${amount}ℏ`, amount);

    try {
      const { ApiSession, Contract } = window.strato;
      const { session } = await ApiSession.default({
        wallet: { type: 'Browser' },
        session: { 
          emitLiveContractReceipts: true,
        }
      });

      const contractId = "0.0.34376129"; // TODO: to env
      const vaultContract = await Contract.newFrom({ path: './TwitterVaultAPI.sol' });
      const liveContract = await session.getLiveContract({ id: contractId, abi: vaultContract.interface });
      const receiptsSubscription = session.subscribeToReceiptsWith(
        ({ transaction, receipt }) => {
          window.test = { transaction };
          console.log(`Transaction ${transaction.transactionId} completed!`);
          toast.success(`Transaction ${transaction.transactionId} completed!`);
        }
      );

      const transactionId = TransactionId.generate(liveContract.session.wallet.account.id);
      const metaArgs = {
        amount: amount,
        // maxTransactionFee: new Hbar(1),
        transactionId: transactionId,
        transactionMemo: `Transfer to @${username}!`,
        transactionValidDuration: 69,
        emitReceipt: true,
      };
      const data = await liveContract.transferFund(metaArgs, username);
      console.log(`Success TransactionId:`, data);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  return (
    <div className={styles.body}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container py-3">
        <header>
          <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
            <a href="/" className="d-flex align-items-center text-dark text-decoration-none">
              <span className="fs-4">Home</span>
            </a>
            <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
              <span className="py-2 me-3 text-dark text-decoration-none">Account balance: {accountBalance}</span>
              <a className="py-2 text-dark text-decoration-none" href="#">Logout</a>
            </nav>
          </div>

          <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
            <h1 className="display-4 fw-normal">TwittBar</h1>
            <p className="fs-5 text-muted">Vault to transfer Hbar(ℏ) via Twitter handle</p>
          </div>
        </header>

        <main className={styles.customForm}>
          <div className="mb-3 d-flex justify-content-center text-center">
            <form className="row" onSubmit={onSubmit}>
              <div className="col-md-5 mb-3">
                <label className="form-label">Twitter username</label>
                <input type="text" className="form-control" name="username" />
                <div className="form-text">Transfer Hbar(ℏ) via twitter username.</div>
              </div>
              <div className="col-md-5 mb-3">
                <label className="form-label">Amount in Hbar(ℏ)</label>
                <input type="number" step=".0001" className="form-control" name="amount" />
              </div>
              <div className="col-md-2 mt-3">
                <button type="submit"
                  className="mt-3 btn btn-primary"
                // style={{ backgroundColor: "#464646" }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>

        <footer className="border-top">
          <div className="d-flex justify-content-end">
            <img className="mt-5" src="/built-on-hedera.png" alt="" width="100"></img>
          </div>
        </footer>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
        />
      </div>

    </div>
  )
}
