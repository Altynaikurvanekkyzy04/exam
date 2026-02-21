import { useState } from 'react'
import { mintNft, mintCollection } from '../services/api'

export default function MintNFT() {
  const [tab, setTab] = useState('nft')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const [nft, setNft] = useState({
    name: 'Супер NFT',
    description: 'Это действительно супер!',
    onchain_image: 'https://avatars.mds.yandex.net/get-mpic/5283122/2a00000190ab13989b372dc056c45244f7a0/90x120',
    collection_address: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
  })

  const [col, setCol] = useState({
    name: 'Супер Коллекция',
    description: 'Супер Коллекция',
    onchain_image: 'https://avatars.mds.yandex.net/get-mpic/5283122/2a00000190ab13989b372dc056c45244f7a0/90x120',
  })

  async function handleMint() {
    setLoading(true); setResult(null); setError('')
    try {
      const res = tab === 'nft' ? await mintNft(nft) : await mintCollection(col)
      setResult(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const form = tab === 'nft' ? nft : col
  const setForm = tab === 'nft' ? setNft : setCol
  const fields = tab === 'nft' ? ['name', 'description', 'onchain_image', 'collection_address'] : ['name', 'description', 'onchain_image']
  const labels = { name: 'Название', description: 'Описание', onchain_image: 'Ссылка на изображение', collection_address: 'Адрес коллекции' }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Создать NFT</h1>
        <p className="page-subtitle">Создание NFT и коллекций в блокчейне TON</p>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div className="glass-card mb-4">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button onClick={() => setTab('nft')} className={tab === 'nft' ? 'btn-ton' : 'btn-ghost'} style={{ flex: 1 }}>🖼️ Создать NFT</button>
            <button onClick={() => setTab('collection')} className={tab === 'collection' ? 'btn-ton' : 'btn-ghost'} style={{ flex: 1 }}>📁 Создать Коллекцию</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(f => (
              <div key={f}>
                <label className="ton-label">{labels[f] || f}</label>
                <input className="ton-input" value={form[f]} onChange={e => setForm(prev => ({ ...prev, [f]: e.target.value }))} />
              </div>
            ))}
          </div>

          {form.onchain_image && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <img src={form.onchain_image} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12, border: '2px solid var(--accent)' }} onError={e => e.target.style.display = 'none'} />
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Предпросмотр</div>
            </div>
          )}

          <div className="ton-divider" />
          <button className="btn-ton" onClick={handleMint} disabled={loading} style={{ width: '100%', padding: 13, fontSize: 15 }}>
            {loading ? '⏳ Создание...' : `✨ Создать ${tab === 'nft' ? 'NFT' : 'Коллекцию'}`}
          </button>
        </div>

        {error && <div className="ton-alert ton-alert-error fade-in">{error}</div>}
        {result && (
          <div className="glass-card fade-in">
            <div className="ton-alert ton-alert-success mb-3">✅ Успешно создано!</div>
            <pre style={{ fontSize: 11, color: 'var(--text2)', overflow: 'auto', maxHeight: 200 }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}