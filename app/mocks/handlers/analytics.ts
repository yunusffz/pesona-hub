import { http, HttpResponse, delay } from 'msw'
import {
  mockActivityLogs,
  mockStatistics,
  mockEconomicStatistics,
  mockTrendingProducts,
  createSuccessResponse,
  createPaginatedResponse,
  paginateArray,
} from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

export const analyticsHandlers = [
  // Log activity
  http.post(`${BASE_URL}/analytics/log`, async ({ request }) => {
    await delay(200)

    const body = await request.json() as any

    const newLog = {
      id: mockActivityLogs.length + 1,
      event_type: body.event_type,
      entity_type: body.entity_type,
      entity_id: body.entity_id || null,
      entity_slug: body.entity_slug || null,
      access_type: body.access_type || 'public',
      extra_data: body.extra_data || {},
      created_at: new Date().toISOString(),
    }

    mockActivityLogs.push(newLog)

    return HttpResponse.json(
      createSuccessResponse(newLog, 'SUCCESS_LOG_ACTIVITY'),
      { status: 201 },
    )
  }),

  // Get activity logs
  http.get(`${BASE_URL}/analytics`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('pagination[page]') || '1')
    const pageSize = Number.parseInt(url.searchParams.get('pagination[pageSize]') || '25')
    const entityType = url.searchParams.get('filters[entity_type][$eq]')
    const eventType = url.searchParams.get('filters[event_type][$eq]')

    let filteredLogs = [...mockActivityLogs]

    // Apply filters
    if (entityType) {
      filteredLogs = filteredLogs.filter((l) => l.entity_type === entityType)
    }
    if (eventType) {
      filteredLogs = filteredLogs.filter((l) => l.event_type === eventType)
    }

    // Sort by created_at desc
    filteredLogs.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    const total = filteredLogs.length
    const paginatedLogs = paginateArray(filteredLogs, page, pageSize)

    return HttpResponse.json(
      createPaginatedResponse(paginatedLogs, page, pageSize, total),
    )
  }),

  // Get entity stats
  http.get(`${BASE_URL}/analytics/:entityType/:entityId/stats`, async ({ params }) => {
    await delay(200)

    const { entityType, entityId } = params

    // Count stats for this entity
    const logs = mockActivityLogs.filter(
      (l) => l.entity_type === entityType && l.entity_id === Number.parseInt(entityId as string),
    )

    const stats = {
      views: logs.filter((l) => l.event_type === 'view').length,
      clicks: logs.filter((l) => l.event_type === 'click').length,
      shares: logs.filter((l) => l.event_type === 'share').length,
      total: logs.length,
    }

    return HttpResponse.json(
      createSuccessResponse(stats),
    )
  }),

  // Get trending entities
  http.get(`${BASE_URL}/analytics/trending/:entityType`, async ({ params }) => {
    await delay(300)

    const { entityType } = params

    if (entityType === 'product') {
      return HttpResponse.json(
        createSuccessResponse(mockTrendingProducts),
      )
    }

    return HttpResponse.json(
      createSuccessResponse([]),
    )
  }),

  // Get event count
  http.get(`${BASE_URL}/analytics/:entityType/:entityId/count/:eventType`, async ({ params }) => {
    await delay(200)

    const { entityType, entityId, eventType } = params

    const count = mockActivityLogs.filter(
      (l) =>
        l.entity_type === entityType
        && l.entity_id === Number.parseInt(entityId as string)
        && l.event_type === eventType,
    ).length

    return HttpResponse.json(
      createSuccessResponse({ count }),
    )
  }),
]
