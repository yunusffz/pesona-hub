import { http, HttpResponse, delay } from 'msw'
import {
  mockCollaborations,
  mockCollaborationImpacts,
  createSuccessResponse,
  createPaginatedResponse,
  paginateArray,
} from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

export const collaborationsHandlers = [
  // Get all collaborations
  http.get(`${BASE_URL}/collaborations`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('pagination[page]') || '1')
    const pageSize = Number.parseInt(url.searchParams.get('pagination[pageSize]') || '25')
    const status = url.searchParams.get('filters[status][$eq]')
    const partnerId = url.searchParams.get('filters[partner_id][$eq]')

    let filteredCollaborations = [...mockCollaborations]

    // Apply filters
    if (status) {
      filteredCollaborations = filteredCollaborations.filter((c) => c.status === status)
    }
    if (partnerId) {
      filteredCollaborations = filteredCollaborations.filter(
        (c) => c.partner_id === Number.parseInt(partnerId),
      )
    }

    const total = filteredCollaborations.length
    const paginatedCollaborations = paginateArray(filteredCollaborations, page, pageSize)

    return HttpResponse.json(
      createPaginatedResponse(paginatedCollaborations, page, pageSize, total),
    )
  }),

  // Get collaboration by ID
  http.get(`${BASE_URL}/collaborations/:id`, async ({ params }) => {
    await delay(200)

    const { id } = params
    const collaboration = mockCollaborations.find((c) => c.id === Number.parseInt(id as string))

    if (!collaboration) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(
      createSuccessResponse(collaboration),
    )
  }),

  // Get collaboration impacts
  http.get(`${BASE_URL}/collaboration-impacts`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('pagination[page]') || '1')
    const pageSize = Number.parseInt(url.searchParams.get('pagination[pageSize]') || '25')

    const total = mockCollaborationImpacts.length
    const paginatedImpacts = paginateArray(mockCollaborationImpacts, page, pageSize)

    return HttpResponse.json(
      createPaginatedResponse(paginatedImpacts, page, pageSize, total),
    )
  }),

  // Get collaboration impact by ID
  http.get(`${BASE_URL}/collaboration-impacts/:id`, async ({ params }) => {
    await delay(200)

    const { id } = params
    const impact = mockCollaborationImpacts.find((i) => i.id === Number.parseInt(id as string))

    if (!impact) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(
      createSuccessResponse(impact),
    )
  }),
]
