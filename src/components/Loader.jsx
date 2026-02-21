export default function Loader({ text = 'Загрузка...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div className="spinner" />
      <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{text}</div>
    </div>
  )
}
