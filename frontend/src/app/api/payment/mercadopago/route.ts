import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, studentName, studentEmail, planLabel } = await request.json()
    // Mercado Pago SDK integration - returns demo preference for now
    return NextResponse.json({
      preferenceId: 'pref_' + Date.now(),
      initPoint: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mp_demo_${Date.now()}`,
      sandboxInitPoint: `https://www.mercadopago.com.br/sandbox/checkout/v1/redirect?pref_id=mp_demo_${Date.now()}`,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
