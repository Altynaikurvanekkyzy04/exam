import { useState } from 'react'
import { mintJetton, burnJetton, closeMint } from '../services/api'

const ACTIONS = ['Создать', 'Сжечь', 'Закрыть минт']

export default function Jetton() {
  const [tab, setTab] = useState('Создать')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const [mintData, setMintData] = useState({
    name: 'Супер Монета', symbol: 'SUP', description: 'Жетон создан через apiton.org',
    image_url: 'https://apiton.org/empty_coin.png', supply: '1000000', max_supply: '1000000',
  })
  const [burnAddr, setBurnAddr] = useState('EQCD60CqCdsABZ1s5z02dizIfoJBETuATkRE0dBo4eWivDvg')
  const [burnAmt, setBurnAmt] = useState('0')
  const [closeAddr, setCloseAddr] = useState('EQCD60CqCdsABZ1s5z02dizIfoJBETuATkRE0dBo4eWivDvg')

  const mintLabels = { name: 'Название', symbol: 'Символ', description: 'Описание', image_url: 'Ссылка на иконку', supply: 'Количество', max_supply: 'Макс. количество' }

  async function handleAction() {
    setLoading(true); setResult(null); setError('')
    try {
      let res
      if (tab === 'Создать') res = await mintJetton(mintData)
      else if (tab === 'Сжечь') res = await burnJetton(burnAddr, parseFloat(burnAmt))
      else res = await closeMint(closeAddr)
      setResult(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Жетоны (Jetton)</h1>
        <p className="page-subtitle">Создание, сжигание и управление жетонами</p>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div className="glass-card mb-4">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {ACTIONS.map(a => (
              <button key={a} onClick={() => setTab(a)} className={tab === a ? 'btn-ton' : 'btn-ghost'} style={{ flex: 1, fontSize: 13 }}>
                {a === 'Создать' ? '🪙' : a === 'Сжечь' ? '🔥' : '🔒'} {a}
              </button>
            ))}
          </div>

          {tab === 'Создать' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.keys(mintData).map(k => (
                <div key={k}>
                  <label className="ton-label">{mintLabels[k] || k}</label>
                  <input className="ton-input" value={mintData[k]} onChange={e => setMintData(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
          )}

          {tab === 'Сжечь' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="ton-label">Адрес жетона</label>
                <input className="ton-input" value={burnAddr} onChange={e => setBurnAddr(e.target.value)} />
              </div>
              <div>
                <label className="ton-label">Количество для сжигания</label>
                <input className="ton-input" type="number" value={burnAmt} onChange={e => setBurnAmt(e.target.value)} />
              </div>
            </div>
          )}

          {tab === 'Закрыть минт' && (
            <div>
              <label className="ton-label">Адрес мастер-жетона</label>
              <input className="ton-input" value={closeAddr} onChange={e => setCloseAddr(e.target.value)} />
              <div className="ton-alert ton-alert-error" style={{ marginTop: 12 }}>
                ⚠️ Это действие необратимо. После закрытия новые токены создать невозможно.
              </div>
            </div>
          )}

          <div className="ton-divider" />
          <button className="btn-ton" onClick={handleAction} disabled={loading} style={{ width: '100%', padding: 13, fontSize: 15 }}>
            {loading ? '⏳ Обработка...' : tab}
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