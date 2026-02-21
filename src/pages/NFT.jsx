import { useState } from 'react'
import { getNftByUsername, getNftByDomain } from '../services/api'
import Loader from '../components/Loader'

function NftCard({ data }) {
  const name = data?.name || data?.username || data?.domain || 'NFT'
  const owner = data?.owner || data?.owner_address || ''
  const image = data?.image || data?.content?.uri || data?.metadata?.image || ''
  const address = data?.address || ''
  const collection = data?.collection?.name || data?.collection_address || ''
  const verified = data?.verified || false

  return (
    <div className="glass-card fade-in">
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{
          width: 100, height: 100, borderRadius: 16, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent), #005f99)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, border: '2px solid var(--accent)', overflow: 'hidden'
        }}>
          {image
            ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
            : '🖼️'}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{name}</div>
            {verified && <span className="badge-ton badge-blue">✓ Верифицирован</span>}
          </div>

          {collection && (
            <div style={{ fontSize: 13, color: 'var(--accent2)', marginTop: 4 }}>📁 {collection}</div>
          )}

          {data?.description && (
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 8, lineHeight: 1.5 }}>{data.description}</div>
          )}

          {owner && (
            <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Владелец</div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text2)', marginTop: 4, wordBreak: 'break-all' }}>{owner}</div>
            </div>
          )}

          {address && (
            <div style={{ marginTop: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Адрес NFT</div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text2)', marginTop: 4, wordBreak: 'break-all' }}>{address}</div>
            </div>
          )}
        </div>
      </div>

      {data?.attributes?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Атрибуты</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {data.attributes.map((a, i) => (
              <div key={i} style={{ background: 'rgba(0,152,234,0.1)', border: '1px solid rgba(0,152,234,0.2)', borderRadius: 8, padding: '6px 12px' }}>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{a.trait_type}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent2)' }}>{a.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function NFT() {
  const [tab, setTab] = useState('username')
  const [username, setUsername] = useState('beijing')
  const [domain, setDomain] = useState('foundation.ton')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    setLoading(true); setError(''); setData(null)
    try {
      const res = tab === 'username' ? await getNftByUsername(username) : await getNftByDomain(domain)
      setData(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Поиск NFT</h1>
        <p className="page-subtitle">Найти NFT по имени пользователя или домену</p>
      </div>

      <div className="glass-card mb-4" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={() => setTab('username')} className={tab === 'username' ? 'btn-ton' : 'btn-ghost'} style={{ flex: 1 }}>👤 Пользователь</button>
          <button onClick={() => setTab('domain')} className={tab === 'domain' ? 'btn-ton' : 'btn-ghost'} style={{ flex: 1 }}>🌐 Домен</button>
        </div>

        {tab === 'username' ? (
          <div>
            <label className="ton-label">Имя пользователя Telegram</label>
            <input className="ton-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="например: beijing" />
          </div>
        ) : (
          <div>
            <label className="ton-label">TON Домен</label>
            <input className="ton-input" value={domain} onChange={e => setDomain(e.target.value)} placeholder="например: foundation.ton" />
          </div>
        )}

        <button className="btn-ton" onClick={handleSearch} disabled={loading} style={{ width: '100%', marginTop: 16, padding: 12 }}>
          <i className="bi bi-search" style={{ marginRight: 6 }} />
          {loading ? 'Поиск...' : 'Найти NFT'}
        </button>
      </div>

      {loading && <Loader text="Поиск NFT..." />}
      {error && <div className="ton-alert ton-alert-error">{error}</div>}
      {data && !loading && <NftCard data={data} />}
    </div>
  )
}