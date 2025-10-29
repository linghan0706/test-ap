export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TonApiConfig {
  apiKey: string
  baseUrl: string
  timeout?: number
}

export interface NetworkConfig {
  rpcEndpoint: string
  apiEndpoint: string
  name: string
  chainId?: string
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
}

export interface ErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown> | null
}