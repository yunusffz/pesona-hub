import { http, HttpResponse, delay } from 'msw'
import {
  mockUsers,
  mockAuthTokens,
  createSuccessResponse,
} from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

// Store the currently logged in user
let currentLoggedInUser: typeof mockUsers[0] | null = null

// Helper to get current user from localStorage
function getCurrentUserFromStorage(): typeof mockUsers[0] | null {
  if (typeof window === 'undefined') return null
  const storedUserId = window.localStorage.getItem('mock_current_user_id')
  if (!storedUserId) return null
  return mockUsers.find(u => u.id === Number.parseInt(storedUserId)) || null
}

// Helper to set current user in localStorage
function setCurrentUserInStorage(userId: number | null) {
  if (typeof window === 'undefined') return
  if (userId === null) {
    window.localStorage.removeItem('mock_current_user_id')
  } else {
    window.localStorage.setItem('mock_current_user_id', userId.toString())
  }
}

export const authHandlers = [
  // Login
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    await delay(500) // Simulate network delay

    const formData = await request.formData()
    const username = formData.get('username')
    const password = formData.get('password')

    // Find user by username or email
    const user = mockUsers.find(
      (u) => u.username === username || u.email === username,
    )

    if (!user || password !== 'password123') {
      return HttpResponse.json(
        {
          message_code: 'ERROR_INVALID_CREDENTIALS',
          data: null,
        },
        { status: 401 },
      )
    }

    // Store the logged in user
    currentLoggedInUser = user
    setCurrentUserInStorage(user.id)

    // Return token response directly (not wrapped in BaseResponse)
    return HttpResponse.json({
      access_token: mockAuthTokens.accessToken,
      refresh_token: mockAuthTokens.refreshToken,
      token_type: mockAuthTokens.tokenType,
    })
  }),

  // Register
  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    await delay(500)

    const body = await request.json() as any

    // Check if username or email already exists
    const usernameExists = mockUsers.some((u) => u.username === body.username)
    const emailExists = mockUsers.some((u) => u.email === body.email)

    if (usernameExists) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_USERNAME_EXISTS',
          data: null,
        },
        { status: 400 },
      )
    }

    if (emailExists) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_EMAIL_EXISTS',
          data: null,
        },
        { status: 400 },
      )
    }

    const newUser = {
      id: mockUsers.length + 1,
      username: body.username,
      email: body.email,
      name: body.name,
      phone: body.phone || null,
      role: body.role || 'PARTNER',
      thumbnail: null,
      details: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    // Set the newly registered user as logged in
    currentLoggedInUser = newUser
    setCurrentUserInStorage(newUser.id)

    // Return token response directly (not wrapped in BaseResponse)
    return HttpResponse.json(
      {
        access_token: mockAuthTokens.accessToken,
        refresh_token: mockAuthTokens.refreshToken,
        token_type: mockAuthTokens.tokenType,
      },
      { status: 201 },
    )
  }),

  // Refresh token
  http.post(`${BASE_URL}/auth/refresh`, async ({ request }) => {
    await delay(300)

    const body = await request.json() as any
    const refreshToken = body.refresh_token

    if (refreshToken !== mockAuthTokens.refreshToken) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_INVALID_REFRESH_TOKEN',
          data: null,
        },
        { status: 401 },
      )
    }

    // Return token response directly (not wrapped in BaseResponse)
    return HttpResponse.json({
      access_token: mockAuthTokens.accessToken,
      refresh_token: mockAuthTokens.refreshToken,
      token_type: mockAuthTokens.tokenType,
    })
  }),

  // Logout
  http.post(`${BASE_URL}/auth/logout`, async () => {
    await delay(200)

    // Clear the logged in user
    currentLoggedInUser = null
    setCurrentUserInStorage(null)

    return HttpResponse.json(
      createSuccessResponse(null, 'SUCCESS_LOGOUT'),
    )
  }),

  // Revoke token
  http.post(`${BASE_URL}/auth/revoke`, async () => {
    await delay(200)

    return HttpResponse.json(
      createSuccessResponse(null, 'SUCCESS_REVOKE_TOKEN'),
    )
  }),

  // Get current user
  http.get(`${BASE_URL}/me`, async ({ request }) => {
    await delay(300)

    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.includes(mockAuthTokens.accessToken)) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_UNAUTHORIZED',
          data: null,
        },
        { status: 401 },
      )
    }

    // Return the currently logged in user from memory or localStorage, or default to first partner
    const currentUser = currentLoggedInUser || getCurrentUserFromStorage() || mockUsers.find((u) => u.role === 'PARTNER') || mockUsers[0]

    // Update in-memory cache if we got it from storage
    if (!currentLoggedInUser && getCurrentUserFromStorage()) {
      currentLoggedInUser = getCurrentUserFromStorage()
    }

    return HttpResponse.json(
      createSuccessResponse(currentUser, 'SUCCESS_GET_USER'),
    )
  }),
]
