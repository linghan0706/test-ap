import { NextResponse } from 'next/server'

// 上游后端基础地址（可通过环境变量覆盖）
const UPSTREAM_BASE = process.env.TG_AUTH_BASE || process.env.API_BASE_URL || 'http://xb8692a8.natappfree.cc'

export async function POST() {
  try {
    const upstreamURL = `${UPSTREAM_BASE.replace(/\/$/, '')}/api/auth/logout`

    const upstreamRes = await fetch(upstreamURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await upstreamRes.json().catch(() => ({ success: false, message: '上游返回非JSON', timestamp: Date.now() }))
    return NextResponse.json(data, { status: upstreamRes.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : '代理登出失败'
    return NextResponse.json(
      { success: false, message, timestamp: Date.now() },
      { status: 502 }
    )
  }
}