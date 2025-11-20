import { http, HttpResponse, delay } from 'msw'
import {
  mockKUPS,
  createSuccessResponse,
  createPaginatedResponse,
  paginateArray,
  filterBySearch,
} from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

export const kupsHandlers = [
  // Get all social forestry business groups
  http.get(`${BASE_URL}/social-forestry-business-groups`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('pagination[page]') || '1')
    const pageSize = Number.parseInt(url.searchParams.get('pagination[pageSize]') || '25')
    const search = url.searchParams.get('filters[name][$contains]')
    const classGroup = url.searchParams.get('filters[class_group][$eq]')

    let filteredKUPS = [...mockKUPS]

    // Apply search
    if (search) {
      filteredKUPS = filterBySearch(filteredKUPS, search, ['name'])
    }

    // Apply class filter
    if (classGroup) {
      filteredKUPS = filteredKUPS.filter((k) => k.class_group === classGroup)
    }

    const total = filteredKUPS.length
    const paginatedKUPS = paginateArray(filteredKUPS, page, pageSize)

    return HttpResponse.json(
      createPaginatedResponse(paginatedKUPS, page, pageSize, total),
    )
  }),

  // Get KUPS by ID
  http.get(`${BASE_URL}/social-forestry-business-groups/:id`, async ({ params }) => {
    await delay(200)

    const { id } = params
    const kups = mockKUPS.find((k) => k.id === Number.parseInt(id as string))

    if (!kups) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(
      createSuccessResponse(kups),
    )
  }),

  // Alias endpoints
  http.get(`${BASE_URL}/social-forestry-groups`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('pagination[page]') || '1')
    const pageSize = Number.parseInt(url.searchParams.get('pagination[pageSize]') || '25')

    const total = mockKUPS.length
    const paginatedKUPS = paginateArray(mockKUPS, page, pageSize)

    return HttpResponse.json(
      createPaginatedResponse(paginatedKUPS, page, pageSize, total),
    )
  }),

  http.get(`${BASE_URL}/social-forestry-groups/:id`, async ({ params }) => {
    await delay(200)

    const { id } = params
    const kups = mockKUPS.find((k) => k.id === Number.parseInt(id as string))

    if (!kups) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(
      createSuccessResponse(kups),
    )
  }),
]
