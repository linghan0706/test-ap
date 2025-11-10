import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

// 计算基础地址：优先使用环境变量，浏览器端默认同源以避免混合内容
function resolveBaseURL(): string {
  const envBase = (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_API_BASE : undefined) || ''
  // 浏览器端：默认同源（空 baseURL），以避免在 HTTPS 页面发起 HTTP 请求导致 Mixed Content
  if (typeof window !== 'undefined') {
    return envBase.trim() || ''
  }
  
  // 服务端：允许使用服务端环境变量指定上游地址
  const serverBase = (typeof process !== 'undefined' ? (process.env?.API_BASE_URL || process.env?.NEXT_PUBLIC_API_BASE) : undefined) || ''
  return (serverBase || envBase).trim()
}

// 创建 axios 实例（统一后端基础地址配置）
const http: AxiosInstance = axios.create({
  // 统一设置后端基础地址（同源优先，避免 Mixed Content）
  baseURL: resolveBaseURL(),
  timeout: 10000, // 10秒超时
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    console.log('发送请求:', config.method?.toUpperCase(), config.url)
    
    // 添加认证 token（如果存在）
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    console.log('响应成功:', response.status, response.config.url)
    
    // 统一处理响应数据格式
    const { data } = response
    
    // 如果后端返回的是标准格式 { code, message, data }
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === 200 || data.code === 0) {
        return data.data || data
      } else {
        // 业务错误
        const errorMessage = data.message || '请求失败'
        console.error('业务错误:', errorMessage)
        return Promise.reject(new Error(errorMessage))
      }
    }
    
    // 直接返回数据
    return data
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('响应错误:', error)
    
    let errorMessage = '网络错误'
    
    if (error.response) {
      // 服务器响应了错误状态码
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          // 清除本地 token
          localStorage.removeItem('token')
          // 可以在这里跳转到登录页
          // window.location.href = '/login'
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务不可用'
          break
        default:
          errorMessage = `请求失败 (${status})`
      }
      
      // 如果后端返回了错误信息，优先使用后端的错误信息
      if (data && typeof data === 'object') {
        if ('message' in data && data.message) {
          errorMessage = data.message as string
        } else if ('error' in data && data.error) {
          errorMessage = data.error as string
        }
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '网络连接超时，请检查网络'
    } else {
      // 其他错误
      errorMessage = error.message || '请求失败'
    }
    
    // 显示错误提示（可以集成 antd 的 message 组件）
    console.error('HTTP Error:', errorMessage)
    
    return Promise.reject(new Error(errorMessage))
  }
)

// 封装常用的请求方法
export const httpUtils = {
  // GET 请求
  get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
    return http.get(url, { params })
  },
  
  // POST 请求
  post<T = unknown>(url: string, data?: unknown): Promise<T> {
    return http.post(url, data)
  },
  
  // PUT 请求
  put<T = unknown>(url: string, data?: unknown): Promise<T> {
    return http.put(url, data)
  },
  
  // DELETE 请求
  delete<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
    return http.delete(url, { params })
  },
  
  // PATCH 请求
  patch<T = unknown>(url: string, data?: unknown): Promise<T> {
    return http.patch(url, data)
  },
  
  // 文件上传
  upload<T = unknown>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    return http.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  },
  
  // 下载文件
  download(url: string, filename?: string): Promise<void> {
    return http.get(url, {
      responseType: 'blob',
    }).then((response) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  },
}

// 导出 axios 实例（用于更复杂的自定义请求）
export default http

// 导出类型定义
export type { AxiosRequestConfig, AxiosResponse, AxiosError }