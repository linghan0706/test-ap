import { NextResponse } from 'next/server'

export const runtime = 'edge'

async function proxy(req: Request) {
  const u = new URL(req.url)
  const base = (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    ''
  ).replace(/\/$/, '')
  const upstream = `${base}${u.pathname}${u.search}`

  const headers = new Headers(req.headers)
  headers.delete('host')

  const bodyText = ['GET', 'HEAD'].includes(req.method)
    ? undefined
    : await req.text()
  const init: RequestInit = { method: req.method, headers, body: bodyText }
  const res = await fetch(upstream, init)
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const data: unknown = await res.json()
    return NextResponse.json(data, { status: res.status })
  }
  const text = await res.text()
  return new NextResponse(text, { status: res.status })
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
