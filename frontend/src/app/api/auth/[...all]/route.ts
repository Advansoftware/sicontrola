import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

async function proxyToBackend(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url)
  const backendUrl = `${BACKEND_URL}${url.pathname}${url.search}`

  const headers: Record<string, string> = {
    'content-type': request.headers.get('content-type') || 'application/json',
  }
  const cookie = request.headers.get('cookie')
  if (cookie) headers['cookie'] = cookie

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD'

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    // @ts-ignore - necessário para streaming com body
    duplex: hasBody ? 'half' : undefined,
  })

  const responseHeaders = new Headers()
  response.headers.forEach((value, key) => {
    // não copiar content-encoding para evitar erros de descompressão dupla
    if (key.toLowerCase() !== 'content-encoding') {
      responseHeaders.set(key, value)
    }
  })

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
}

export async function GET(request: NextRequest) {
  return proxyToBackend(request)
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request)
}

export async function DELETE(request: NextRequest) {
  return proxyToBackend(request)
}

export async function PATCH(request: NextRequest) {
  return proxyToBackend(request)
}
