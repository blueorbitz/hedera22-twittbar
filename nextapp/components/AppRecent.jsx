import axios from 'axios';
import { useEffect, useState } from 'react'
import { Hbar } from '@hashgraph/sdk'
import { timeSince } from '../helpers/utils'

export default function AppRecent({ refreshComponent }) {
  const limit = 3;
  const [skip, setSkip] = useState(0);
  const [transactions, setTransactions] = useState([]);
  
  const fetchData = async () => {
    const params = {
      skip, limit,
      from: `${window.hedera.account.id}`
    };
    const res = await axios.get('/api/transaction', { params });
    return res.data;
  }

  const loadMore = async () => {
    if (skip === -1)
      return;

    await setSkip(skip + limit);
    const data = await fetchData();
    if (data.length === 0)
      setSkip(-1)

    const trxs = transactions.concat(data);
    setTransactions(trxs);
  }

  useEffect(() => {
    async function load() {
      // reset
      setSkip(0);
      const data = await fetchData();
      setTransactions(data);
    }
    load();
  }, [refreshComponent])

  return (<>
    <div className="d-flex justify-content-center flex-row">
      <h5>Recent Transfer:</h5>
    </div>
    <div className='d-flex justify-content-center pb-5'>
      <div className="list-group" style={{ maxWidth: '570px' }}>
        {
          transactions.map(({ transactionId, from, to, amount, timestamp }, index) => {
            const transactionPath = transactionId.split('@').join('').split('.').join('');

            return (
              <a
                key={transactionId}
                href={`https://testnet.dragonglass.me/transactions/${transactionPath}`}
                className="list-group-item list-group-item-action d-flex gap-3 py-3"
                aria-current="true"
                target="_blank"
              >
                <img src="/black-cutout.png" alt="twbs" width="32" height="32" className="rounded-circle flex-shrink-0" />
                <div className="d-flex gap-2 w-100 justify-content-between">
                  <div>
                    <h6 className="mb-0">
                      {`${new Hbar(amount).toString()} to `}
                      <strong><i><a href={`https://twitter.com/${to}`} target="_blank">{to}</a></i></strong>
                    </h6>
                    <p className="mb-0 mt-1 opacity-75"><pre className='mb-0'>{transactionId}</pre></p>
                  </div>
                  <small className="opacity-50 text-nowrap">{timeSince(new Date(timestamp)) + ' ago'}</small>
                </div>
              </a>
            );
          })
        }
        {
          skip === -1 ? null :
          <div className="list-group-item list-group-item-action d-flex gap-3 py-3" onClick={loadMore}>
            <div className="d-flex gap-2 w-100 justify-content-center">
              <small className="opacity-50 text-nowrap">more...</small>
            </div>
          </div>
        }
      </div>
    </div>
  </>);
}