import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { amount, studentName, studentEmail, planLabel } = await request.json()
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key')

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'brl',
      metadata: { studentName, planLabel, system: 'sicontrola' },
      description: `SICONTROLA - ${planLabel} - ${studentName}`,
      receipt_email: studentEmail,
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
