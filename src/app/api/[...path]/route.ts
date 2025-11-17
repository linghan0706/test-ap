import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

async function proxy(req: Request) {
  const u = new URL(req.url)
  const base = (process.env.API_BASE_URL || '').replace(/\/$/, '')
  if (!base) {
    return NextResponse.json(
      { success: false, message: 'API_BASE_URL not set', timestamp: Date.now() },
      { status: 500 }
    )
  }
  const upstream = `${base}${u.pathname}${u.search}`

  const headers = new Headers(req.headers)
  headers.delete('host')
  headers.delete('origin')
  headers.delete('referer')
  const originalHost = req.headers.get('host') || ''
  const proto = u.protocol === 'https:' ? 'https' : 'http'
  if (originalHost) headers.set('x-forwarded-host', originalHost)
  headers.set('x-forwarded-proto', proto)
  const xf = req.headers.get('x-forwarded-for')
  const xr = req.headers.get('x-real-ip')
  if (xf) headers.set('x-forwarded-for', xf)
  if (xr) headers.set('x-real-ip', xr)
  const path = u.pathname
  const requiresAuth =
    path.startsWith('/api/store') || path === '/api/auth/logout'
  if (requiresAuth) {
    const auth = headers.get('authorization')
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized', timestamp: Date.now() },
        { status: 401 }
      )
    }
  }

  const bodyText = ['GET', 'HEAD'].includes(req.method)
    ? undefined
    : await req.text()
  const init: RequestInit = { method: req.method, headers, body: bodyText }
  const res = await fetch(upstream, init)
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const data: unknown = await res.json()
    const needsNormalize = u.pathname === '/api/auth/login'
    const isObj = data && typeof data === 'object'
    const hasStdShape = isObj && ('code' in (data as Record<string, unknown>) || 'success' in (data as Record<string, unknown>))
    const normalized = needsNormalize && !hasStdShape
      ? {
          code: res.status,
          success: res.status >= 200 && res.status < 300,
          data,
          message: '',
          timestamp: Date.now(),
        }
      : data
    const out = NextResponse.json(normalized, { status: res.status })
    out.headers.set('x-proxy-upstream', upstream)
    out.headers.set('x-proxy-runtime', 'nodejs')
    return out
  }
  const text = await res.text()
  const out = new NextResponse(text, { status: res.status })
  out.headers.set('x-proxy-upstream', upstream)
  out.headers.set('x-proxy-runtime', 'nodejs')
  return out
}

export async function GET(req: Request) {
  return proxy(req)
}

export async function POST(req: Request) {
  return proxy(req)
}

export async function PUT(req: Request) {
  return proxy(req)
}

export async function PATCH(req: Request) {
  return proxy(req)
}

export async function DELETE(req: Request) {
  return proxy(req)
}
