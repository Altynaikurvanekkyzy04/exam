import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCryptoRates, getFiatRates } from '../services/api'
import Loader from '../components/Loader'
import { parseRates } from '../utils/parseRates'

const DEFAULT_ADDRESS = 'UQCdqXGvONLwOr3zCNX5FjapflorB6ZsOdcdfLrjsDLt3AF4'

export default function Dashboard() {
    const [rates, setRates] = useState(null)
    const [fiat, setFiat] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        ; (async () => {
            try {
                const [r, f] = await Promise.all([
                    getCryptoRates(['TON', 'BTC', 'ETH', 'BNB']),
                    getFiatRates(['EUR', 'USD', 'RUB']),
                ])
                console.log('CRYPTO RAW:', r)
                console.log('FIAT RAW:', f)
                setRates(r)
                setFiat(f)
            } catch (e) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        })()
    }, [])



    const cryptoList = parseRates(rates)
    const fiatList = parseRates(fiat)
    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Главная</h1>
                <p className="page-subtitle">TON Блокчейн — Обзор в реальном времени</p>
            </div>

            <div className="glow-card mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="balance-label">Мой кошелёк</div>
                        <div className="balance-amount" style={{ marginTop: 8 }}>TON</div>
                        <div className="address-text" style={{ marginTop: 10 }}>{DEFAULT_ADDRESS}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="badge-ton badge-blue">💎 Сеть TON</div>
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                            <Link to="/send" className="btn-ton" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none', display: 'inline-block' }}>
                                <i className="bi bi-send-fill" style={{ marginRight: 6 }} />Отправить
                            </Link>
                            <Link to="/wallet" className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none', display: 'inline-block' }}>
                                <i className="bi bi-eye" style={{ marginRight: 6 }} />Просмотр
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { icon: 'bi-wallet2', label: 'Кошелёк', value: 'Активен', color: 'var(--green)', to: '/wallet' },
                    { icon: 'bi-arrow-left-right', label: 'Транзакции', value: 'Смотреть все', color: 'var(--accent2)', to: '/transactions' },
                    { icon: 'bi-image', label: 'Поиск NFT', value: 'Исследовать', color: 'var(--yellow)', to: '/nft' },
                    { icon: 'bi-coin', label: 'Жетоны', value: 'Управление', color: 'var(--red)', to: '/jetton' },
                ].map((s) => (
                    <Link key={s.to} to={s.to} style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <i className={`bi ${s.icon}`} style={{ fontSize: 22, color: s.color }} />
                            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{s.label}</div>
                            <div style={{ fontSize: 14, color: s.color, fontWeight: 700, marginTop: 2 }}>{s.value}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800 }}>Курсы криптовалют</h3>
                        <Link to="/rates" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Все курсы →</Link>
                    </div>
                    {loading ? <Loader text="Загрузка курсов..." /> : error ? (
                        <div className="ton-alert ton-alert-error">{error}</div>
                    ) : cryptoList.length > 0 ? cryptoList.map((r, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                                    {r.symbol === 'BTC' ? '₿' : r.symbol === 'ETH' ? 'Ξ' : r.symbol === 'TON' ? '💎' : '🪙'}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{r.symbol || r.name}</span>
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)' }}>
                                {r.price
                                    ? r.price.toLocaleString('ru-RU', { maximumFractionDigits: 4 })
                                    : '—'
                                } <span style={{ fontSize: 11, color: 'var(--text3)' }}>TON</span>
                            </span>
                        </div>
                    )) : (
                        <div style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: 16 }}>Данные недоступны</div>
                    )}
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800 }}>Фиатные курсы</h3>
                        <span className="badge-ton badge-green">В реальном времени</span>
                    </div>
                    {loading ? <Loader text="Загрузка..." /> : fiatList.length > 0 ? fiatList.map((r, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{r.symbol || r.name}</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)' }}>
  {r.price
    ? r.price.toLocaleString('ru-RU', { maximumFractionDigits: 4 })
    : '—'
  } <span style={{ fontSize: 11, color: 'var(--text3)' }}>TON</span>
</span>
                        </div>
                    )) : (
                        <div style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: 16 }}>Данные недоступны</div>
                    )}
                </div>
            </div>
        </div>
    )
}