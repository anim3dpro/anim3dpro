import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { key, mac } = await req.json()

  if (!key) {
    return NextResponse.json({ error: 'Clé manquante' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('licenses')
    .select('*')
    .eq('key', key)
    .single()

  if (error || !data) {
    return NextResponse.json({ valid: false, reason: 'not_found' })
  }

  if (data.status !== 'active') {
    return NextResponse.json({ valid: false, reason: 'inactive' })
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: 'expired' })
  }

  if (!mac) {
    return NextResponse.json({ valid: true })
  }

  const macs: string[] = data.mac_addresses
    ? JSON.parse(data.mac_addresses)
    : []

  if (macs.includes(mac)) {
    return NextResponse.json({ valid: true })
  }

  if (macs.length >= 2) {
    return NextResponse.json({ valid: false, reason: 'mac_limit' })
  }

  macs.push(mac)
  await supabaseAdmin
    .from('licenses')
    .update({ mac_addresses: JSON.stringify(macs) })
    .eq('key', key)

  return NextResponse.json({ valid: true })
}