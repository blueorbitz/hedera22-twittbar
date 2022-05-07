import Head from 'next/head'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import AppFooter from '../components/AppFooter'
import { ToastContainer, toast } from 'react-toastify'
import styles from '../styles/Home.module.css'
import 'react-toastify/dist/ReactToastify.css'
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session)
      router.push({ pathname: '/' });
  }, [session]);

  const onMapAccount = async (event) => {
    event.preventDefault();
    try {
      const account = document.getElementsByName('accountId')[0].value;
      await axios.post('/api/contract/map', { account });
      toast.success(`Successfully release pending fund.`);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  const onReleaseFund = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/api/contract/release');
      toast.success(`Successfully release pending fund.`);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  return (
    <div className={styles.body}>
      <Head>
        <title>Twitter | Twittbar</title>
        <meta name="description" content="Transfer Hbar(ℏ) via Twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container py-3">
        <header>
          <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
            <a href="/" className="d-flex align-items-center text-dark text-decoration-none">
              <span className="fs-4">Home <small className='text-muted'>testnet</small></span>
            </a>
            <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
              <a className="py-2 text-dark text-decoration-none" href="#" onClick={signOut}>Logout</a>
            </nav>
          </div>
          <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
            <h1 className="display-4 fw-normal">TwittBar</h1>
            <p className="fs-5 text-muted">Make Hbar (ℏ) transfer simple via Twitter@handle</p>
          </div>
        </header>

        <main className={styles.customForm}>
          <div className='d-flex justify-content-center'>
            <div className='text-center'>
              <h4>How to receive the Fund</h4>
              <div>1. <a
                href="https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk"
                target="_blank">
                Install Hashpack extension
              </a></div>
              <div>2. <a
                href="https://www.hashpack.app/post/how-to-create-your-first-account-with-hashpack"
                target="_blank"
              >
                Create your first account with HashPack
              </a></div>
              <div>3. Paste your account Id here.</div>
              <input type="text" style={{ width: '300px' }}
                className="form-control" name="accountId"
                placeholder='eg. 0.0.312334'
              />
              <div className="btn-group">
                <button className="mt-3 btn btn-secondary" onClick={onMapAccount}>
                  Map Account
                </button>
                <button className="mt-3 btn btn-primary" onClick={onReleaseFund}>
                  Release Fund
                </button>
              </div>
            </div>
          </div>
        </main>
        <AppFooter />
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
