import { useState, useEffect } from 'react'
import { getCryptoRates, getFiatRates } from '../services/api'
import Loader from '../components/Loader'
import { parseRates } from '../utils/parseRates'

const CRYPTO_ICONS = { TON: '💎', BTC: '₿', ETH: 'Ξ', BNB: '🟡', SOL: '◎', USDT: '💵' }
const FIAT_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', RUB: '🇷🇺', GBP: '🇬🇧' }



export default function Rates() {
    const [crypto, setCrypto] = useState(null)
    const [fiat, setFiat] = useState(null)
    const [loading, setLoading] = useState(true)
    const [symbols, setSymbols] = useState('TON,BTC,ETH,BNB')
    const [error, setError] = useState('')
    const [showRaw, setShowRaw] = useState(false)

    async function fetchRates() {
        setLoading(true); setError('')
        try {
            const symList = symbols.split(',').map(s => s.trim()).filter(Boolean)
            const [c, f] = await Promise.all([
                getCryptoRates(symList),
                getFiatRates(['EUR', 'USD', 'RUB', 'GBP']),
            ])
            setCrypto(c)
            setFiat(f)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchRates() }, [])

    const cryptoList = parseRates(crypto)
    const fiatList = parseRates(fiat)

    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Курсы валют</h1>
                <p className="page-subtitle">Актуальные данные с TON API</p>
            </div>

            <div className="glass-card mb-4">
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label className="ton-label">Символы (через запятую)</label>
                        <input className="ton-input" value={symbols} onChange={e => setSymbols(e.target.value)} />
                    </div>
                    <button className="btn-ton" onClick={fetchRates} disabled={loading}>
                        <i className="bi bi-arrow-clockwise" style={{ marginRight: 6 }} />Обновить
                    </button>
                    <button className="btn-ghost" onClick={() => setShowRaw(p => !p)}>
                        {showRaw ? 'Скрыть' : 'Сырой ответ'}
                    </button>
                </div>
            </div>


            {showRaw && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                    <div className="glass-card">
                        <div style={{ fontSize: 12, color: 'var(--accent2)', fontWeight: 700, marginBottom: 8 }}>RAW: getCryptoRates()</div>
                        <pre style={{ fontSize: 11, color: 'var(--text2)', overflow: 'auto', maxHeight: 300 }}>
                            {JSON.stringify(crypto, null, 2)}
                        </pre>
                    </div>
                    <div className="glass-card">
                        <div style={{ fontSize: 12, color: 'var(--accent2)', fontWeight: 700, marginBottom: 8 }}>RAW: getFiatRates()</div>
                        <pre style={{ fontSize: 11, color: 'var(--text2)', overflow: 'auto', maxHeight: 300 }}>
                            {JSON.stringify(fiat, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            {loading ? <Loader text="Загрузка курсов..." /> : error ? (
                <div className="ton-alert ton-alert-error">{error}</div>
            ) : (
                <>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                        🔷 Криптовалюты {cryptoList.length === 0 && <span style={{ color: 'var(--red)' }}>— нажми "Сырой ответ" чтобы увидеть что пришло</span>}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
                        {cryptoList.length > 0 ? cryptoList.map((r, i) => {
                            const sym = r.symbol || r.name || `#${i}`
                            const price = r.price
                            return (
                                <div key={i} style={{
                                    background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20,
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                            {CRYPTO_ICONS[sym] || '🪙'}
                                        </div>
                                        <span className="badge-ton badge-blue">{sym}</span>
                                    </div>
                                    <div style={{ fontSize: 22, fontWeight: 800, marginTop: 12 }}>
                                        {price
                                            ? price < 0.01
                                                ? price.toFixed(8)
                                                : price.toLocaleString('ru-RU', { maximumFractionDigits: 4 })
                                            : '—'
                                        }
                                        <span style={{ fontSize: 13, color: 'var(--text3)', marginLeft: 4 }}>TON</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{r.name || 'Криптовалюта'}</div>
                                </div>
                            )
                        }) : (
                            <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 24, color: 'var(--text3)' }}>
                                Данные получены, но формат не распознан.<br />
                                <button className="btn-ghost" style={{ marginTop: 12 }} onClick={() => setShowRaw(true)}>
                                    Показать сырой ответ →
                                </button>
                            </div>
                        )}
                    </div>

                    <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                        💱 Фиатные валюты
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                        {fiatList.length > 0 ? fiatList.map((r, i) => {
                            const sym = r.symbol || r.name || `#${i}`
                            const val = r.price
                            return (
                                <div key={i} style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
                                    <div style={{ fontSize: 28 }}>{FIAT_FLAGS[sym] || '🏳️'}</div>
                                    <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: 8, color: 'var(--accent2)' }}>{sym}</div>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)', marginTop: 4 }}>
                                        {typeof val === 'number' ? val.toLocaleString('ru-RU') : val || '—'}
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 24, color: 'var(--text3)' }}>
                                Нет данных — нажми "Сырой ответ"
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}