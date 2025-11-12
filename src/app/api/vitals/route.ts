export const runtime = 'edge'

export async function POST(req: Request) {
  await req.json().catch(() => null)
  return new Response(null, { status: 200 })
}
