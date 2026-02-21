import { useState } from 'react'
import { getWallets, getDetails } from '../services/api'
import Loader from '../components/Loader'

export default function WalletPage() {
  const [address, setAddress] = useState('UQCdqXGvONLwOr3zCNX5FjapflorB6ZsOdcdfLrjsDLt3AF4')
  const [wallets, setWallets] = useState(null)
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('wallets')

  async function handleSearch() {
    if (!address.trim()) return
    setLoading(true); setError(''); setWallets(null); setDetails(null)
    try {
      const [w, d] = await Promise.all([getWallets(address), getDetails(address)])
      setWallets(w); setDetails(d)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const w = wallets
  const d = details

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Мой кошелёк</h1>
        <p className="page-subtitle">Информация о TON-адресе</p>
      </div>

      <div className="glass-card mb-4">
        <label className="ton-label">Адрес TON</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="ton-input" value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Введите TON адрес..." onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <button className="btn-ton" onClick={handleSearch} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
            <i className="bi bi-search" style={{ marginRight: 6 }} />Найти
          </button>
        </div>
      </div>

      {loading && <Loader text="Загрузка данных кошелька..." />}
      {error && <div className="ton-alert ton-alert-error mb-3">{error}</div>}

      {(w || d) && !loading && (
        <div className="fade-in">
          <div className="glow-card mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--accent), #005f99)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                💎
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>TON Кошелёк</div>
                <div className="address-text" style={{ marginTop: 4 }}>{address.slice(0, 20)}...{address.slice(-8)}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className={`badge-ton ${(w?.status || d?.status) === 'active' ? 'badge-green' : 'badge-yellow'}`}>
                  {(w?.status || d?.status) === 'active' ? '● Активен' : '● Неактивен'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Баланс</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent2)', marginTop: 4 }}>
                  {w?.balance ?? d?.balance ?? '—'} <span style={{ fontSize: 14 }}>TON</span>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Тип кошелька</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                  {w?.wallet_type || w?.type || d?.wallet_type || 'v4R2'}
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Транзакции</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                  {w?.transactions_count || d?.transactions_count || '—'}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={() => setTab('wallets')} className={tab === 'wallets' ? 'btn-ton' : 'btn-ghost'}>Кошельки</button>
            <button onClick={() => setTab('details')} className={tab === 'details' ? 'btn-ton' : 'btn-ghost'}>Детали</button>
          </div>

          <div className="glass-card">
            {Object.entries(tab === 'wallets' ? (w || {}) : (d || {})).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>{k.replace(/_/g, ' ')}</span>
                <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: typeof v === 'number' ? 'var(--font-mono)' : 'inherit', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>
                  {typeof v === 'boolean'
                    ? <span className={`badge-ton ${v ? 'badge-green' : 'badge-red'}`}>{v ? 'Да' : 'Нет'}</span>
                    : typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}