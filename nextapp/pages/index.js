import Head from 'next/head'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import AppTransfer from '../components/AppTransfer'
import { ToastContainer, toast } from 'react-toastify'
import styles from '../styles/Home.module.css'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {

  return (
    <div className={styles.body}>
      <Head>
        <title>Home | Twittbar</title>
        <meta name="description" content="Transfer Hbar(ℏ) via Twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container py-3">
        <AppHeader />
        <AppTransfer />
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
