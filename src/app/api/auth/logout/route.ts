import { NextResponse } from 'next/server'
export const runtime = 'edge'

// 上游后端基础地址（可通过环境变量覆盖）
const UPSTREAM_BASE =
  process.env.TG_AUTH_BASE ||
  process.env.API_BASE_URL ||
  'https://73a850f805e7.ngrok-free.app'

// 获取更详细的错误信息
function getErrorMessage(error: unknown, upstreamURL: string): string {
  if (error instanceof Error) {
    const errorName = error.name
    const errorMessage = error.message

    // 根据错误类型提供更详细的错误信息
    if (errorName === 'TypeError' && errorMessage.includes('fetch')) {
      return `无法连接到后端服务器 (${upstreamURL})。请检查：1) 后端服务是否运行 2) 网络连接是否正常 3) 后端地址是否正确`
    }

    if (
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ENOTFOUND')
    ) {
      return `无法连接到后端服务器 (${upstreamURL})。服务器可能未启动或地址配置错误`
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
      return `请求超时。后端服务器 (${upstreamURL}) 响应时间过长`
    }

    if (errorMessage.includes('CORS')) {
      return `CORS 错误：后端服务器 (${upstreamURL}) 未允许跨域请求`
    }

    // 返回原始错误消息，但添加更多上下文
    return `网络请求失败: ${errorMessage} (目标: ${upstreamURL})`
  }

  return `未知错误: 无法连接到后端服务器 (${upstreamURL})`
}

export async function POST() {
  try {
    const upstreamURL = `${UPSTREAM_BASE.replace(/\/$/, '')}/api/auth/logout`

    console.log('Requesting upstream logout endpoint:', upstreamURL)
    console.log('Backend base URL config:', UPSTREAM_BASE)

    // 添加超时控制（15秒）
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const upstreamRes = await fetch(upstreamURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // 检查响应状态
      if (!upstreamRes.ok) {
        console.error(
          `Upstream server returned error status: ${upstreamRes.status} ${upstreamRes.statusText}`
        )
      }

      const data = await upstreamRes.json().catch(() => {
        console.error('Upstream returned non-JSON data')
        return {
          success: false,
          message: '上游返回非JSON',
          timestamp: Date.now(),
        }
      })

      return NextResponse.json(data, { status: upstreamRes.status })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      // 检查是否是超时错误
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        const errorMessage = `Request timeout: Backend server (${upstreamURL}) did not respond within 15 seconds`
        console.error(errorMessage)
        return NextResponse.json(
          { success: false, message: errorMessage, timestamp: Date.now() },
          { status: 504 }
        )
      }

      // 重新抛出以在外部 catch 中处理
      throw fetchError
    }
  } catch (error) {
    const upstreamURL = `${UPSTREAM_BASE.replace(/\/$/, '')}/api/auth/logout`
    const errorMessage = getErrorMessage(error, upstreamURL)

    console.error('Logout proxy error:', {
      error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      upstreamURL,
      upstreamBase: UPSTREAM_BASE,
    })

    return NextResponse.json(
      { success: false, message: errorMessage, timestamp: Date.now() },
      { status: 502 }
    )
  }
}
