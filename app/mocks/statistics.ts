import { mockProducts, mockKUPS, mockLocations, mockUsers } from './data'

/**
 * Calculate statistics from mock data
 */
export function calculateMockStatistics() {
  // Count unique provinces from KUPS
  const uniqueProvinces = new Set(
    mockKUPS
      .filter((k) => k.location?.province)
      .map((k) => k.location!.province),
  )

  // Count partners (users with PARTNER role)
  const partnersCount = mockUsers.filter((u) => u.role === 'PARTNER').length

  return {
    kupsCount: mockKUPS.length,
    productsCount: mockProducts.length,
    provincesCount: uniqueProvinces.size,
    partnersCount,
  }
}

/**
 * Calculate economic statistics from mock data
 */
export function calculateEconomicStatistics() {
  // Calculate total value from products (price * stock)
  const totalValue = mockProducts.reduce((sum, product) => {
    return sum + (product.price * (product.stock_quantity || 0))
  }, 0)

  // Calculate total stock
  const totalStock = mockProducts.reduce((sum, product) => {
    return sum + (product.stock_quantity || 0)
  }, 0)

  // Average price
  const averagePrice = mockProducts.reduce((sum, product) => sum + product.price, 0) / mockProducts.length

  return {
    totalProduction: totalStock,
    totalEconomicValue: totalValue,
    averagePrice: Math.round(averagePrice),
  }
}

/**
 * Get trending products based on activity
 */
export function getTrendingProducts(limit: number = 5) {
  // In a real scenario, this would be based on activity logs
  // For mock purposes, we'll return top products by ID
  return mockProducts.slice(0, limit).map((product, index) => ({
    product_id: product.id,
    views: 250 - (index * 30),
    clicks: 35 - (index * 5),
    shares: 15 - (index * 2),
  }))
}
