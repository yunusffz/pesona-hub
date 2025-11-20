export * from './users'
export * from './commodities'
export * from './locations'
export * from './kups'
export * from './products'
export * from './analytics'
export * from './collaborations'

// Helper functions for mock data
export function generatePaginationMeta(
  page: number,
  pageSize: number,
  total: number,
) {
  return {
    pagination: {
      page,
      page_size: pageSize,
      total,
      total_pages: Math.ceil(total / pageSize),
    },
  }
}

export function createSuccessResponse<T>(
  data: T,
  messageCode: string = 'SUCCESS_GET_DATA',
) {
  return {
    message_code: messageCode,
    data,
  }
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number,
  messageCode: string = 'SUCCESS_GET_DATA',
) {
  return {
    message_code: messageCode,
    data,
    meta: generatePaginationMeta(page, pageSize, total),
  }
}

export function filterBySearch<T extends Record<string, any>>(
  items: T[],
  searchQuery: string,
  fields: (keyof T)[],
): T[] {
  if (!searchQuery) return items

  const query = searchQuery.toLowerCase()
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field]
      return value && String(value).toLowerCase().includes(query)
    }),
  )
}

export function filterByFields<T extends Record<string, any>>(
  items: T[],
  filters: Record<string, any>,
): T[] {
  return items.filter((item) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) return true
      if (Array.isArray(value)) {
        return value.includes(item[key])
      }
      return item[key] === value
    }),
  )
}

export function paginateArray<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 25,
): T[] {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  return items.slice(startIndex, endIndex)
}
