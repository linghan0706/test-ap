import { NextResponse } from 'next/server'

export const runtime = 'nodejs'   // Vercel 使用 Node.js Runtime

type RouteContext = { params: { path: string[] } }

async function proxy(req: Request, params: { path: string[] }) {
  const base = process.env.API_BASE_URL?.replace(/\/$/, '')
  if (!base) {
    return NextResponse.json(
      { success: false, message: 'API_BASE_URL not set' },
      { status: 500 }
    )
  }

  // 例如：前端访问 /api/proxy/tasks/center → 代理到 /api/tasks/center
  const backendPath = `/api/${params.path.join('/')}`

  const u = new URL(req.url)
  const upstream = `${base}${backendPath}${u.search}`

  const headers = new Headers(req.headers)
  headers.delete('host')

  // 额外修复：Vercel 不自动转发 cookie，需要手动设置
  const cookie = req.headers.get('cookie')
  if (cookie) headers.set('cookie', cookie)

  // body 处理
  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : await req.text()

  if (body && !headers.get('content-type')) {
    headers.set('content-type', 'application/json')
  }

  const res = await fetch(upstream, {
    method: req.method,
    headers,
    body,
  })

  const contentType = res.headers.get('content-type') || ''
  const proxyHeaders = new Headers(res.headers)
  proxyHeaders.set('x-proxy-upstream', upstream)

  if (contentType.includes('application/json')) {
    const data = await res.json()
    return NextResponse.json(data, {
      status: res.status,
      headers: proxyHeaders,
    })
  }

  return new NextResponse(await res.text(), {
    status: res.status,
    headers: proxyHeaders,
  })
}

// 支持所有方法
export async function GET(req: Request, ctx: RouteContext) {
  return proxy(req, ctx.params)
}
export async function POST(req: Request, ctx: RouteContext) {
  return proxy(req, ctx.params)
}
export async function PUT(req: Request, ctx: RouteContext) {
  return proxy(req, ctx.params)
}
export async function PATCH(req: Request, ctx: RouteContext) {
  return proxy(req, ctx.params)
}
export async function DELETE(req: Request, ctx: RouteContext) {
  return proxy(req, ctx.params)
}
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
