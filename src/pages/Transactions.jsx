import { useState } from 'react'
import { getTransactions } from '../services/api'
import Loader from '../components/Loader'

function TxCard({ tx, index }) {
  const isIn = !!tx.in_msg
  const hash = tx.hash || tx.id || ''
  const amount = tx.amount || tx.value || tx.in_msg?.value || tx.out_msgs?.[0]?.value || '0'
  const time = tx.utime ? new Date(tx.utime * 1000).toLocaleString('ru-RU') : '—'
  const from = tx.in_msg?.source || tx.from || '—'
  const to = tx.out_msgs?.[0]?.destination || tx.to || '—'
  const fee = tx.fee || tx.total_fee || '—'
  const comment = tx.in_msg?.message || tx.comment || ''

  return (
    <div style={{
      background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 14,
      padding: 18, marginBottom: 12, transition: 'border-color 0.2s',
      borderLeft: `3px solid ${isIn ? 'var(--green)' : 'var(--red)'}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: isIn ? 'rgba(34,211,165,0.15)' : 'rgba(255,77,106,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>
            {isIn ? '↙️' : '↗️'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{isIn ? 'Получено' : 'Отправлено'}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              #{index + 1} · {time}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: isIn ? 'var(--green)' : 'var(--red)' }}>
            {isIn ? '+' : '-'}{amount} TON
          </div>
          {fee !== '—' && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Комиссия: {fee}</div>}
        </div>
      </div>

      {(from !== '—' || to !== '—') && (
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>От</div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', marginTop: 4, wordBreak: 'break-all' }}>
              {from.length > 30 ? from.slice(0, 16) + '...' + from.slice(-8) : from}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Кому</div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', marginTop: 4, wordBreak: 'break-all' }}>
              {to.length > 30 ? to.slice(0, 16) + '...' + to.slice(-8) : to}
            </div>
          </div>
        </div>
      )}

      {comment && (
        <div style={{ marginTop: 10, background: 'rgba(0,152,234,0.08)', borderRadius: 8, padding: '8px 12px' }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>💬 </span>
          <span style={{ fontSize: 12, color: 'var(--accent2)' }}>{comment}</span>
        </div>
      )}

      {hash && (
        <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          Хэш: {hash.slice(0, 32)}...
        </div>
      )}
    </div>
  )
}

export default function Transactions() {
  const [address, setAddress] = useState('EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N')
  const [limit, setLimit] = useState('10')
  const [txs, setTxs] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFetch() {
    if (!address.trim()) return
    setLoading(true); setError(''); setTxs(null)
    try {
      const data = await getTransactions(address, limit)
      setTxs(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const list = txs?.transactions || txs?.data || (Array.isArray(txs) ? txs : [])

  const totalIn = list.filter(t => t.in_msg).length
  const totalOut = list.filter(t => !t.in_msg).length

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Транзакции</h1>
        <p className="page-subtitle">История операций на блокчейне</p>
      </div>

      <div className="glass-card mb-4">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'flex-end' }}>
          <div>
            <label className="ton-label">Адрес</label>
            <input className="ton-input" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div>
            <label className="ton-label">Лимит</label>
            <select className="ton-input" value={limit} onChange={e => setLimit(e.target.value)} style={{ width: 90 }}>
              {['5', '10', '20', '50'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <button className="btn-ton" onClick={handleFetch} disabled={loading}>
            <i className="bi bi-search" style={{ marginRight: 6 }} />Загрузить
          </button>
        </div>
      </div>

      {loading && <Loader text="Загрузка транзакций..." />}
      {error && <div className="ton-alert ton-alert-error mb-3">{error}</div>}

      {list.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{list.length}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>ВСЕГО</div>
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green)' }}>+{totalIn}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>ПОЛУЧЕНО</div>
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--red)' }}>-{totalOut}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>ОТПРАВЛЕНО</div>
            </div>
          </div>

          {list.map((tx, i) => <TxCard key={i} tx={tx} index={i} />)}
        </>
      )}

      {txs && list.length === 0 && !loading && (
        <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 40 }}>📭</div>
          <div style={{ fontSize: 14, color: 'var(--text3)', marginTop: 12 }}>Транзакции не найдены</div>
        </div>
      )}
    </div>
  )
}