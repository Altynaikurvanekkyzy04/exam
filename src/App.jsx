import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import WalletPage from './pages/WalletPage'
import Transactions from './pages/Transactions'
import Send from './pages/Send'
import Rates from './pages/Rates'
import Exchanges from './pages/Exchanges'
import NFT from './pages/NFT'
import MintNFT from './pages/MintNFT'
import Jetton from './pages/Jetton'
import Login from './pages/Login'
import Auth from './pages/Auth'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/send" element={<Send />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/exchanges" element={<Exchanges />} />
          <Route path="/nft" element={<NFT />} />
          <Route path="/mint-nft" element={<MintNFT />} />
          <Route path="/jetton" element={<Jetton />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  )
}