import { http, HttpResponse, delay } from 'msw'
import {
  mockProducts,
  createSuccessResponse,
  createPaginatedResponse,
  filterBySearch,
  filterByFields,
  paginateArray,
} from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

export const productsHandlers = [
  // Get all products with filters
  http.get(`${BASE_URL}/products`, async ({ request }) => {
    await delay(400)

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('pagination[page]') || '1')
    const pageSize = Number.parseInt(url.searchParams.get('pagination[pageSize]') || '25')
    const search = url.searchParams.get('filters[name][$contains]')
    const commodityId = url.searchParams.get('filters[commodity_id][$eq]')
    const locationProvince = url.searchParams.get('filters[social_forestry_business_group][location][province][$eq]')
    const minPrice = url.searchParams.get('filters[price][$gte]')
    const maxPrice = url.searchParams.get('filters[price][$lte]')
    const sortBy = url.searchParams.get('sort[0]')

    let filteredProducts = [...mockProducts]

    // Apply search filter
    if (search) {
      filteredProducts = filterBySearch(
        filteredProducts,
        search,
        ['name', 'description'],
      )
    }

    // Apply field filters
    const filters: Record<string, any> = {}
    if (commodityId) {
      filters.commodity_id = Number.parseInt(commodityId)
    }

    if (Object.keys(filters).length > 0) {
      filteredProducts = filterByFields(filteredProducts, filters)
    }

    // Apply location filter
    if (locationProvince) {
      filteredProducts = filteredProducts.filter(
        (p) => p.social_forestry_business_group?.location?.province === locationProvince,
      )
    }

    // Apply price range filter
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= Number.parseInt(minPrice),
      )
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= Number.parseInt(maxPrice),
      )
    }

    // Apply sorting
    if (sortBy) {
      const [field, order] = sortBy.split(':')
      filteredProducts.sort((a: any, b: any) => {
        const aVal = a[field]
        const bVal = b[field]
        if (order === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }

    const total = filteredProducts.length
    const paginatedProducts = paginateArray(filteredProducts, page, pageSize)

    return HttpResponse.json(
      createPaginatedResponse(paginatedProducts, page, pageSize, total),
    )
  }),

  // Get product by ID
  http.get(`${BASE_URL}/products/:id`, async ({ params }) => {
    await delay(300)

    const { id } = params
    const product = mockProducts.find((p) => p.id === Number.parseInt(id as string))

    if (!product) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(
      createSuccessResponse(product),
    )
  }),
]
