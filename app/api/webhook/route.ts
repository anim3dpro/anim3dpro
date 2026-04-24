import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createLicense } from '@/lib/licenses'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email!
    const productId = session.metadata?.product_id ?? 'unknown'
    const licenseType = session.mode === 'subscription' ? 'subscription' : 'lifetime'
    const subscriptionId = session.subscription as string | undefined

    await createLicense({
      email,
      type: licenseType,
      product_id: productId,
      stripe_subscription_id: subscriptionId,
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    // On gérera l'expiration des abonnements ici plus tard
  }

  return NextResponse.json({ received: true })
}