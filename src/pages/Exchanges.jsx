import { useState, useEffect } from 'react'
import { getExchanges } from '../services/api'
import Loader from '../components/Loader'

export default function Exchanges() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getExchanges([]).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const list = data?.exchanges || data?.data || (Array.isArray(data) ? data : [])

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Биржи</h1>
        <p className="page-subtitle">Курсы обменных площадок</p>
      </div>

      {loading ? <Loader text="Загрузка бирж..." /> : error ? (
        <div className="ton-alert ton-alert-error">{error}</div>
      ) : (
        <div className="glass-card">
          {list.length > 0 ? (
            <table className="ton-table">
              <thead>
                <tr>
                  <th>Биржа</th>
                  <th>Курс</th>
                  <th>Объём</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {list.map((ex, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: 'var(--text)' }}>{ex.name || ex.exchange || `Биржа ${i + 1}`}</td>
                    <td className="mono">{ex.rate || ex.price || '—'}</td>
                    <td>{ex.volume || '—'}</td>
                    <td><span className="badge-ton badge-green">Активна</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 40 }}>🏦</div>
              <div style={{ fontSize: 14, color: 'var(--text3)', marginTop: 12 }}>Ответ API:</div>
              <pre style={{ fontSize: 11, color: 'var(--text2)', marginTop: 12, textAlign: 'left', overflow: 'auto', maxHeight: 300 }}>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}