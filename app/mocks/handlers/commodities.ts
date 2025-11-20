import { http, HttpResponse, delay } from 'msw'
import {
  mockCommodities,
  mockCommodityPriorities,
  createSuccessResponse,
  createPaginatedResponse,
  paginateArray,
} from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

export const commoditiesHandlers = [
  // Get all commodities
  http.get(`${BASE_URL}/commodities`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('pagination[page]') || '1')
    const pageSize = Number.parseInt(url.searchParams.get('pagination[pageSize]') || '50')

    const total = mockCommodities.length
    const paginatedCommodities = paginateArray(mockCommodities, page, pageSize)

    return HttpResponse.json(
      createPaginatedResponse(paginatedCommodities, page, pageSize, total),
    )
  }),

  // Get commodity by ID
  http.get(`${BASE_URL}/commodities/:id`, async ({ params }) => {
    await delay(200)

    const { id } = params
    const commodity = mockCommodities.find((c) => c.id === Number.parseInt(id as string))

    if (!commodity) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(
      createSuccessResponse(commodity),
    )
  }),

  // Get commodity priorities
  http.get(`${BASE_URL}/commodities/priorities`, async () => {
    await delay(200)

    return HttpResponse.json(
      createSuccessResponse(mockCommodityPriorities),
    )
  }),
]
