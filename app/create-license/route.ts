import { NextRequest, NextResponse } from 'next/server'
import { createLicense } from '@/lib/licenses'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.SUPABASE_SECRET_KEY}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { email, type, product_id, stripe_subscription_id } = await req.json()

  if (!email || !type || !product_id) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  try {
    const license = await createLicense({
      email,
      type,
      product_id,
      stripe_subscription_id,
    })
    return NextResponse.json({ success: true, license })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}