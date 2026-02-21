export function parseRates(data) {
  if (!data) return []

  const source = data?.result || data?.rates || data?.data || data
  
  if (Array.isArray(source)) return source
  
  if (typeof source === 'object') {
    return Object.entries(source).map(([symbol, val]) => ({
      symbol,
      price: typeof val === 'number' ? val : val?.price ?? val?.usd ?? null,
      name: symbol,
    }))
  }
  
  return []
}