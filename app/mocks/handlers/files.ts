import { http, HttpResponse, delay } from 'msw'
import { createSuccessResponse } from '../data'

const BASE_URL = 'http://103.235.75.47:5500'

const mockFiles: any[] = []
let fileIdCounter = 1

export const filesHandlers = [
  // Upload file
  http.post(`${BASE_URL}/files`, async ({ request }) => {
    await delay(800) // Simulate slower upload

    const formData = await request.formData()
    const file = formData.get('file')
    const description = formData.get('description')

    if (!file) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_FILE_REQUIRED',
          data: null,
        },
        { status: 400 },
      )
    }

    // Create mock file response
    const mockFileName = `mock-upload-${fileIdCounter}-${Date.now()}.jpg`
    const mockFile = {
      id: fileIdCounter++,
      object_name: mockFileName,
      url: `/uploads/${mockFileName}`,
      description: description || null,
      uploaded_at: new Date().toISOString(),
    }

    mockFiles.push(mockFile)

    return HttpResponse.json(
      createSuccessResponse(mockFile, 'SUCCESS_UPLOAD_FILE'),
      { status: 201 },
    )
  }),

  // Get file by ID
  http.get(`${BASE_URL}/files/:id`, async ({ params }) => {
    await delay(200)

    const { id } = params
    const file = mockFiles.find((f) => f.id === Number.parseInt(id as string))

    if (!file) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json(
      createSuccessResponse(file),
    )
  }),

  // Get file by object name
  http.get(`${BASE_URL}/files/:objectName`, async ({ params }) => {
    await delay(200)

    const { objectName } = params
    const file = mockFiles.find((f) => f.object_name === objectName)

    if (!file) {
      // Return a placeholder image URL
      return HttpResponse.json(
        createSuccessResponse({
          url: `https://placehold.co/400x400?text=Mock+Image`,
        }),
      )
    }

    return HttpResponse.json(
      createSuccessResponse(file),
    )
  }),

  // Delete file
  http.delete(`${BASE_URL}/files/:id`, async ({ params }) => {
    await delay(300)

    const { id } = params
    const fileIndex = mockFiles.findIndex((f) => f.id === Number.parseInt(id as string))

    if (fileIndex === -1) {
      return HttpResponse.json(
        {
          message_code: 'ERROR_NOT_FOUND',
          data: null,
        },
        { status: 404 },
      )
    }

    mockFiles.splice(fileIndex, 1)

    return HttpResponse.json(
      createSuccessResponse(null, 'SUCCESS_DELETE_FILE'),
    )
  }),
]
