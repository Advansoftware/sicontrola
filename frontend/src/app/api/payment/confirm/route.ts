import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { studentId, provider, transactionId, amount } = await request.json()
    return NextResponse.json({
      success: true,
      message: 'Pagamento confirmado',
      data: { studentId, provider, transactionId, amount, confirmedAt: new Date().toISOString() }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
