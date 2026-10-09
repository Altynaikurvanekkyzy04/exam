import { useState } from 'react'
import { authNew, authDo, authDelete, authList } from '../services/api'

const ACTIONS = [
  { key: 'New', label: 'Новая сессия', icon: '🔑' },
  { key: 'Do', label: 'Авторизоваться', icon: '✅' },
  { key: 'Delete', label: 'Удалить', icon: '🗑️' },
  { key: 'List', label: 'Список', icon: '📋' },
]

export default function Auth() {
  const [tab, setTab] = useState('New')
  const [token, setToken] = useState('1:2427eba5ddefc80c5679718eeb8425590041')
  const [address, setAddress] = useState('UQCQV3TKMhNJuTTfT4VUm4tZ79vnK1arIyMzNlgqmNSlkPaX')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleAction() {
    setLoading(true); setResult(null); setError('')
    try {
      let res
      if (tab === 'New') res = await authNew(token)
      else if (tab === 'Do') res = await authDo(token, address)
      else if (tab === 'Delete') res = await authDelete(token, address)
      else res = await authList(token)
      setResult(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const needsAddress = ['Do', 'Delete'].includes(tab)

  const descriptions = {
    New: 'Создать новую сессию авторизации по токену доступа',
    Do: 'Привязать адрес кошелька к токену',
    Delete: 'Удалить авторизацию для адреса кошелька',
    List: 'Показать все авторизованные кошельки для этого токена',
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <p className="page-subtitle">Управление сессиями авторизации кошелька</p>
      </div>
      <div style={{ maxWidth: 560 }}>
        <div className="glass-card mb-4">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
            {ACTIONS.map(a => (
              <button key={a.key} onClick={() => setTab(a.key)} className={tab === a.key ? 'btn-ton' : 'btn-ghost'} style={{ fontSize: 13, padding: '10px' }}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="ton-label">Токен доступа</label>
              <input className="ton-input mono" value={token} onChange={e => setToken(e.target.value)} />
            </div>
            {needsAddress && (
              <div>
                <label className="ton-label">Адрес кошелька</label>
                <input className="ton-input" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            )}
          </div>
          <div className="ton-alert ton-alert-info" style={{ marginTop: 16 }}>
            <strong>Auth/{tab}</strong> — {descriptions[tab]}
          </div>
          <div className="ton-divider" />
          <button className="btn-ton" onClick={handleAction} disabled={loading} style={{ width: '100%', padding: 13, fontSize: 15 }}>
            {loading ? '⏳ Обработка...' : ACTIONS.find(a => a.key === tab)?.label}
          </button>
        </div>
        {error && <div className="ton-alert ton-alert-error fade-in">{error}</div>}
        {result && (
          <div className="glass-card fade-in">
            <div className="ton-alert ton-alert-success mb-3">✅ Готово!</div>
            <pre style={{ fontSize: 11, color: 'var(--text2)', overflow: 'auto', maxHeight: 200 }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}