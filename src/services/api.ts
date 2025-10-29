import { ApiResponse, RequestConfig, ErrorResponse } from '@/types'

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown> | null
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(
    baseUrl: string,
    options: {
      headers?: Record<string, string>
      timeout?: number
    } = {}
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    this.timeout = options.timeout || 10000
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      params,
      timeout = this.timeout,
    } = config

    const url = new URL(`${this.baseUrl}${endpoint}`)
    
    // 添加查询参数
    if (params && method === 'GET') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    }

    // 添加请求体
    if (params && method !== 'GET') {
      requestInit.body = JSON.stringify(params)
    }

    try {
      const response = await fetch(url.toString(), requestInit)
      
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json().catch(() => ({
          code: 'UNKNOWN_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        }))
        
        throw new ApiError(
          errorData.code,
          errorData.message,
          errorData.details
        )
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('TIMEOUT', '请求超时')
        }
        
        throw new ApiError('NETWORK_ERROR', error.message)
      }
      
      throw new ApiError('UNKNOWN_ERROR', '未知错误')
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', params: data })
  }

  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', params: data })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}