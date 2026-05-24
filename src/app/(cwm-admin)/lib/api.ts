const API_BASE = '/api'

export type PaginatedResponse<T = any> = {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type QueryParams = {
  page?: number
  limit?: number
  sort?: string
  where?: Record<string, any>
  depth?: number
}

function buildQueryString(params: QueryParams): string {
  const qs = new URLSearchParams()
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.sort) qs.set('sort', params.sort)
  if (params.depth !== undefined) qs.set('depth', String(params.depth))
  if (params.where) {
    for (const [field, condition] of Object.entries(params.where)) {
      if (typeof condition === 'object') {
        for (const [op, val] of Object.entries(condition)) {
          qs.set(`where[${field}][${op}]`, String(val))
        }
      } else {
        qs.set(`where[${field}][equals]`, String(condition))
      }
    }
  }
  return qs.toString()
}

async function request<T = any>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {}
  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: { ...headers, ...options?.headers as Record<string, string> },
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = data?.errors?.[0]?.message || data?.message || `Request failed: ${res.status}`
    throw new Error(message)
  }

  return data as T
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ user: any; token: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request('/users/logout', { method: 'POST' }),

  me: () =>
    request<{ user: any }>('/users/me'),

  // Collections
  list: (slug: string, params: QueryParams = {}) =>
    request<PaginatedResponse>(`/${slug}?${buildQueryString(params)}`),

  get: (slug: string, id: string | number, depth = 1) =>
    request<any>(`/${slug}/${id}?depth=${depth}`),

  create: (slug: string, data: Record<string, any>) =>
    request<{ doc: any }>(`/${slug}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (slug: string, id: string | number, data: Record<string, any>) =>
    request<{ doc: any }>(`/${slug}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (slug: string, id: string | number) =>
    request(`/${slug}/${id}`, { method: 'DELETE' }),

  // Globals
  getGlobal: (slug: string) =>
    request<any>(`/globals/${slug}`),

  updateGlobal: (slug: string, data: Record<string, any>) =>
    request<any>(`/globals/${slug}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Media upload
  upload: (file: File, alt?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (alt) formData.append('alt', alt)
    return request<{ doc: any }>('/media', {
      method: 'POST',
      body: formData,
    })
  },

  // Search (collection-level text search)
  search: (slug: string, query: string, params: QueryParams = {}) => {
    const where: Record<string, any> = {}
    if (query) {
      // Payload uses 'like' operator for text search
      where['_search'] = { like: query }
    }
    return api.list(slug, { ...params, where: { ...params.where, ...where } })
  },
}
