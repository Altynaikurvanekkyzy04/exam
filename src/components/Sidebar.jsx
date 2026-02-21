import { NavLink } from 'react-router-dom'

const navItems = [
  { section: 'Кошелёк' },
  { to: '/', icon: 'bi-house-fill', label: 'Главная' },
  { to: '/wallet', icon: 'bi-wallet2', label: 'Мой кошелёк' },
  { to: '/transactions', icon: 'bi-arrow-left-right', label: 'Транзакции' },
  { to: '/send', icon: 'bi-send-fill', label: 'Отправить' },
  { section: 'Рынок' },
  { to: '/rates', icon: 'bi-graph-up-arrow', label: 'Курсы валют' },
  { to: '/exchanges', icon: 'bi-bank', label: 'Биржи' },
  { section: 'NFT и Токены' },
  { to: '/nft', icon: 'bi-image', label: 'Поиск NFT' },
  { to: '/mint-nft', icon: 'bi-stars', label: 'Создать NFT' },
  { to: '/jetton', icon: 'bi-coin', label: 'Жетоны' },
  { section: 'Аккаунт' },
  { to: '/auth', icon: 'bi-shield-lock', label: 'Авторизация' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="logo-gem">💎</span>
          <span className="logo-text">TON<span>Кошелёк</span></span>
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>Основная сеть</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-title">{item.section}</div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </NavLink>
          )
        )}
      </nav>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          apiton.p.rapidapi.com
        </div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Блокчейн TON</div>
      </div>
    </aside>
  )
}