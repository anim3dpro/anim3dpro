import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { priceId, productId } = await req.json()

  if (!priceId || !productId) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  const isSubscription = priceId === process.env.STRIPE_PRICE_SUBSCRIPTION

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: isSubscription ? 'subscription' : 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    metadata: { product_id: productId },
  })

  return NextResponse.json({ url: session.url })
}