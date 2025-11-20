import type { ActivityLog } from '~/types/entities'

export const mockActivityLogs: ActivityLog[] = [
  // Product views
  {
    id: 1,
    event_type: 'view',
    entity_type: 'product',
    entity_id: 1,
    entity_slug: 'kopi-arabika-premium',
    access_type: 'public',
    extra_data: { referrer: 'catalog' },
    created_at: '2024-05-15T08:30:00Z',
  },
  {
    id: 2,
    event_type: 'view',
    entity_type: 'product',
    entity_id: 1,
    entity_slug: 'kopi-arabika-premium',
    access_type: 'public',
    extra_data: { referrer: 'catalog' },
    created_at: '2024-05-15T09:15:00Z',
  },
  {
    id: 3,
    event_type: 'view',
    entity_type: 'product',
    entity_id: 2,
    entity_slug: 'kopi-robusta',
    access_type: 'public',
    extra_data: { referrer: 'landing' },
    created_at: '2024-05-15T10:00:00Z',
  },
  {
    id: 4,
    event_type: 'view',
    entity_type: 'product',
    entity_id: 3,
    entity_slug: 'biji-kakao-fermentasi',
    access_type: 'public',
    extra_data: { referrer: 'catalog' },
    created_at: '2024-05-15T11:20:00Z',
  },
  {
    id: 5,
    event_type: 'view',
    entity_type: 'product',
    entity_id: 4,
    entity_slug: 'madu-hutan-multiflora',
    access_type: 'public',
    extra_data: { referrer: 'search' },
    created_at: '2024-05-15T12:45:00Z',
  },

  // Product clicks
  {
    id: 6,
    event_type: 'click',
    entity_type: 'product',
    entity_id: 1,
    entity_slug: 'kopi-arabika-premium',
    access_type: 'public',
    extra_data: { action: 'contact_seller' },
    created_at: '2024-05-15T08:35:00Z',
  },
  {
    id: 7,
    event_type: 'click',
    entity_type: 'product',
    entity_id: 14,
    entity_slug: 'kayu-gaharu-super',
    access_type: 'public',
    extra_data: { action: 'contact_seller' },
    created_at: '2024-05-15T13:20:00Z',
  },

  // Product shares
  {
    id: 8,
    event_type: 'share',
    entity_type: 'product',
    entity_id: 1,
    entity_slug: 'kopi-arabika-premium',
    access_type: 'public',
    extra_data: { platform: 'whatsapp' },
    created_at: '2024-05-15T09:00:00Z',
  },
  {
    id: 9,
    event_type: 'share',
    entity_type: 'product',
    entity_id: 12,
    entity_slug: 'minyak-cendana-murni',
    access_type: 'public',
    extra_data: { platform: 'facebook' },
    created_at: '2024-05-15T14:30:00Z',
  },

  // Collaboration requests
  {
    id: 10,
    event_type: 'create',
    entity_type: 'collaboration',
    entity_id: 1,
    access_type: 'internal',
    extra_data: { product_id: 1, partner_id: 2 },
    created_at: '2024-05-15T10:00:00Z',
  },
  {
    id: 11,
    event_type: 'create',
    entity_type: 'collaboration',
    entity_id: 2,
    access_type: 'internal',
    extra_data: { product_id: 7, partner_id: 3 },
    created_at: '2024-05-15T15:30:00Z',
  },

  // User registrations
  {
    id: 12,
    event_type: 'create',
    entity_type: 'user',
    entity_id: 2,
    access_type: 'internal',
    extra_data: { role: 'PARTNER' },
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 13,
    event_type: 'create',
    entity_type: 'user',
    entity_id: 3,
    access_type: 'internal',
    extra_data: { role: 'PARTNER' },
    created_at: '2024-02-01T00:00:00Z',
  },

  // Profile updates
  {
    id: 14,
    event_type: 'update',
    entity_type: 'user',
    entity_id: 2,
    access_type: 'internal',
    extra_data: { fields_updated: ['collaboration_commodities', 'address'] },
    created_at: '2024-05-10T08:00:00Z',
  },
]

export const mockStatistics = {
  kupsCount: 80,
  productsCount: 234,
  provincesCount: 15,
  partnersCount: 45,
}

export const mockEconomicStatistics = {
  totalProduction: 125000,
  totalEconomicValue: 15750000000,
  averagePrice: 126000,
}

export const mockTrendingProducts = [
  { product_id: 1, views: 245, clicks: 34, shares: 12 },
  { product_id: 14, views: 198, clicks: 28, shares: 8 },
  { product_id: 12, views: 176, clicks: 22, shares: 15 },
  { product_id: 4, views: 145, clicks: 18, shares: 6 },
  { product_id: 7, views: 132, clicks: 25, shares: 4 },
]
