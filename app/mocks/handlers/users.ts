import { http, HttpResponse, delay } from 'msw'
import {
  mockUsers,
  createSuccessResponse,
  createPaginatedResponse,
  paginateArray,
} from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

export const usersHandlers = [
  // Get all users
  http.get(`${BASE_URL}/users`, async ({ request }) => {
    await delay(300)

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('pagination[page]') || '1')
    const pageSize = Number.parseInt(url.searchParams.get('pagination[pageSize]') || '25')
    const role = url.searchParams.get('filters[role][$eq]')

    let filteredUsers = [...mockUsers]

    // Apply role filter
    if (role) {
      filteredUsers = filteredUsers.filter((u) => u.role === role)
    }

    const total = filteredUsers.length
    const paginatedUsers = paginateArray(filteredUsers, page, pageSize)

    return HttpResponse.json(
      createPaginatedResponse(paginatedUsers, page, pageSize, total),
    )
  }),

  // Get user by username
  http.get(`${BASE_URL}/users/:username`, async ({ params }) => {
    await delay(200)

    const { username } = params
    const user = mockUsers.find((u) => u.username === username)

    if (!user) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(
      createSuccessResponse(user),
    )
  }),

  // Update user
  http.patch(`${BASE_URL}/users/:username`, async ({ params, request }) => {
    await delay(400)

    const { username } = params
    const updates = await request.json() as any
    const userIndex = mockUsers.findIndex((u) => u.username === username)

    if (userIndex === -1) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    // Update user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    return HttpResponse.json(
      createSuccessResponse(mockUsers[userIndex], 'SUCCESS_UPDATE_USER'),
    )
  }),

  // Delete user
  http.delete(`${BASE_URL}/users/:username`, async ({ params }) => {
    await delay(300)

    const { username } = params
    const userIndex = mockUsers.findIndex((u) => u.username === username)

    if (userIndex === -1) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    mockUsers.splice(userIndex, 1)

    return HttpResponse.json(
      createSuccessResponse(null, 'SUCCESS_DELETE_USER'),
    )
  }),
]
