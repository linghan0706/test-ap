import { NextResponse } from 'next/server'

export const runtime = 'edge'

const cacheStore = new Map<
  string,
  { exp: number; status: number; json: unknown }
>()

function ttlFor(pathname: string): number {
  if (pathname.startsWith('/api/store/items')) return 60_000
  if (pathname.startsWith('/api/store/center')) return 30_000
  if (pathname.startsWith('/api/tasks/center')) return 30_000
  return 0
}

function needMask(pathname: string): boolean {
  if (pathname.startsWith('/api/store/orders')) return true
  if (pathname.startsWith('/api/store/purchase/submit')) return true
  return false
}

function needSign(pathname: string): boolean {
  if (pathname.startsWith('/api/store/purchase/submit')) return true
  if (pathname.startsWith('/api/store/exchange')) return true
  return false
}

function maskValue(v: unknown): unknown {
  if (typeof v !== 'string') return v
  const s = v as string
  if (s.length <= 10) return s
  return s.slice(0, 6) + '****' + s.slice(-4)
}

function maskJSON(input: unknown): unknown {
  if (Array.isArray(input)) return input.map(maskJSON)
  if (input && typeof input === 'object') {
    const obj = input as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(obj)) {
      if (k === 'walletAddress' || k === 'transactionHash') {
        out[k] = maskValue(obj[k])
      } else {
        out[k] = maskJSON(obj[k])
      }
    }
    return out
  }
  return input
}

async function hexSha256(s: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = enc.encode(s)
  const digest = await crypto.subtle.digest('SHA-256', buf)
  const bytes = new Uint8Array(digest)
  let h = ''
  for (let i = 0; i < bytes.length; i++)
    h += bytes[i].toString(16).padStart(2, '0')
  return h
}

async function proxy(req: Request) {
  const base = (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    ''
  ).replace(/\/$/, '')
  const u = new URL(req.url)
  const upstream = `${base}${u.pathname}${u.search}`

  const cacheKey = u.pathname + u.search
  const ttl = ttlFor(u.pathname)
  if (req.method === 'GET' && ttl > 0) {
    const hit = cacheStore.get(cacheKey)
    if (hit && hit.exp > Date.now())
      return NextResponse.json(hit.json, { status: hit.status })
  }

  const headers = new Headers(req.headers)
  headers.delete('host')

  let bodyText: string | undefined
  if (!['GET', 'HEAD'].includes(req.method)) bodyText = await req.text()

  if (needSign(u.pathname) && bodyText) {
    const ts = Date.now().toString()
    const secret = process.env.API_PROXY_SIGN_SECRET || ''
    const sig = await hexSha256(secret + '\n' + bodyText + '\n' + ts)
    headers.set('x-proxy-timestamp', ts)
    headers.set('x-proxy-sign', sig)
  }

  const init: RequestInit = { method: req.method, headers, body: bodyText }
  const res = await fetch(upstream, init)
  const data = await res.json().catch(() => null)

  if (data !== null) {
    const jsonOut = needMask(u.pathname) ? maskJSON(data) : data
    if (req.method === 'GET' && ttl > 0)
      cacheStore.set(cacheKey, {
        exp: Date.now() + ttl,
        status: res.status,
        json: jsonOut,
      })
    return NextResponse.json(jsonOut, { status: res.status })
  }

  const text = await res.text().catch(() => '')
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
