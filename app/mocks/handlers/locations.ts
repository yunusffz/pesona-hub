import { http, HttpResponse, delay } from 'msw'
import {
  mockLocations,
  createSuccessResponse,
  createPaginatedResponse,
  paginateArray,
} from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

export const locationsHandlers = [
  // Get all locations
  http.get(`${BASE_URL}/locations`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('pagination[page]') || '1')
    const pageSize = Number.parseInt(url.searchParams.get('pagination[pageSize]') || '50')
    const province = url.searchParams.get('filters[province][$eq]')
    const district = url.searchParams.get('filters[district][$eq]')

    let filteredLocations = [...mockLocations]

    // Apply filters
    if (province) {
      filteredLocations = filteredLocations.filter((l) => l.province === province)
    }
    if (district) {
      filteredLocations = filteredLocations.filter((l) => l.district === district)
    }

    const total = filteredLocations.length
    const paginatedLocations = paginateArray(filteredLocations, page, pageSize)

    return HttpResponse.json(
      createPaginatedResponse(paginatedLocations, page, pageSize, total),
    )
  }),

  // Get location by ID
  http.get(`${BASE_URL}/locations/:id`, async ({ params }) => {
    await delay(200)

    const { id } = params
    const location = mockLocations.find((l) => l.id === Number.parseInt(id as string))

    if (!location) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(
      createSuccessResponse(location),
    )
  }),
]
