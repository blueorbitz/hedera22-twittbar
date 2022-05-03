import Head from 'next/head'
import { useRouter } from 'next/router';
import styles from '../styles/Signin.module.css'

export default function Signin() {
  const router = useRouter();

  const onClick = async () => {
    try {
      await window.connectToHashPack();
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.body}>
      <Head>
        <title>Login | Twittbar</title>
        <meta name="description" content="Transfer Hbar(ℏ) via Twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.formSignin}>
        <form>
          <h1 className="mb-1 fw-normal">TwittBar</h1>
          <p className="mb-3">Transfer to Hbar(ℏ) vault via Twitter@handle</p>
          <div className="w-100 btn btn-lg btn-primary" onClick={onClick}>Connect Wallet</div>
          <img className="mt-5" src="/built-on-hedera.png" alt="" width="120"></img>
          <p className="mb-3 text-muted">choong.pw &copy; 2022</p>
        </form>
      </main>
    </div>
  )
}
