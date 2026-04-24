import { NextRequest, NextResponse } from 'next/server'
import { verifyLicense } from '@/lib/licenses'

export async function POST(req: NextRequest) {
  const { key } = await req.json()

  if (!key) {
    return NextResponse.json({ error: 'Clé manquante' }, { status: 400 })
  }

  const result = await verifyLicense(key)
  return NextResponse.json(result)
}