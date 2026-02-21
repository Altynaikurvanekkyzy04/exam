import { useState } from 'react'
import { sendTon, sendJetton, sendNft } from '../services/api'

const TABS = ['TON', 'Жетон', 'NFT']

export default function Send() {
  const [tab, setTab] = useState('TON')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const [tonAddr, setTonAddr] = useState('foundation.ton')
  const [tonAmount, setTonAmount] = useState('0.01')
  const [tonComment, setTonComment] = useState('')

  const [jetAddr, setJetAddr] = useState('EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N')
  const [jetMaster, setJetMaster] = useState('EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT')
  const [jetAmount, setJetAmount] = useState('0')

  const [nftAddr, setNftAddr] = useState('EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N')
  const [nftAddr2, setNftAddr2] = useState('EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT')

  async function handleSend() {
    setLoading(true); setResult(null); setError('')
    try {
      let res
      if (tab === 'TON') res = await sendTon(tonAddr, tonAmount, tonComment)
      else if (tab === 'Жетон') res = await sendJetton(jetAddr, jetMaster, parseFloat(jetAmount))
      else res = await sendNft(nftAddr, nftAddr2)
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
        <h1 className="page-title">Отправить</h1>
        <p className="page-subtitle">Перевод TON, Жетонов или NFT</p>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div className="glass-card mb-4">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => { setTab(t); setResult(null); setError('') }}
                className={tab === t ? 'btn-ton' : 'btn-ghost'} style={{ flex: 1, padding: '10px', fontSize: 14 }}>
                {t === 'TON' ? '💎' : t === 'Жетон' ? '🪙' : '🖼️'} {t}
              </button>
            ))}
          </div>

          {tab === 'TON' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="ton-label">Адрес получателя</label>
                <input className="ton-input" value={tonAddr} onChange={e => setTonAddr(e.target.value)} placeholder="адрес или .ton домен" />
              </div>
              <div>
                <label className="ton-label">Сумма (TON)</label>
                <input className="ton-input" type="number" value={tonAmount} onChange={e => setTonAmount(e.target.value)} step="0.01" />
              </div>
              <div>
                <label className="ton-label">Комментарий (необязательно)</label>
                <input className="ton-input" value={tonComment} onChange={e => setTonComment(e.target.value)} placeholder="Сообщение..." />
              </div>
            </div>
          )}

          {tab === 'Жетон' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="ton-label">Адрес получателя</label>
                <input className="ton-input" value={jetAddr} onChange={e => setJetAddr(e.target.value)} />
              </div>
              <div>
                <label className="ton-label">Адрес мастер-жетона</label>
                <input className="ton-input" value={jetMaster} onChange={e => setJetMaster(e.target.value)} />
              </div>
              <div>
                <label className="ton-label">Количество</label>
                <input className="ton-input" type="number" value={jetAmount} onChange={e => setJetAmount(e.target.value)} />
              </div>
            </div>
          )}

          {tab === 'NFT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="ton-label">Адрес получателя</label>
                <input className="ton-input" value={nftAddr} onChange={e => setNftAddr(e.target.value)} />
              </div>
              <div>
                <label className="ton-label">Адрес NFT</label>
                <input className="ton-input" value={nftAddr2} onChange={e => setNftAddr2(e.target.value)} />
              </div>
            </div>
          )}

          <div className="ton-divider" />
          <div style={{ background: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.2)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 700 }}>⚠️ Внимание</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Используется реальный API. Тестируйте только с небольшими суммами.</div>
          </div>

          <button className="btn-ton" onClick={handleSend} disabled={loading} style={{ width: '100%', padding: 14, fontSize: 15 }}>
            {loading ? '⏳ Отправка...' : `Отправить ${tab}`}
          </button>
        </div>

        {error && <div className="ton-alert ton-alert-error fade-in">{error}</div>}
        {result && (
          <div className="glass-card fade-in">
            <div className="ton-alert ton-alert-success mb-3">✅ Транзакция отправлена!</div>
            <pre style={{ fontSize: 11, color: 'var(--text2)', overflow: 'auto', maxHeight: 200 }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}