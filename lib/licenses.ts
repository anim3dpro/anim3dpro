import { supabaseAdmin } from './supabase'

function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segment = () =>
    Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')
  return `A3D-${segment()}-${segment()}-${segment()}`
}

export async function createLicense({
  email,
  type,
  product_id,
  stripe_subscription_id,
}: {
  email: string
  type: 'lifetime' | 'subscription'
  product_id: string
  stripe_subscription_id?: string
}) {
  const key = generateLicenseKey()

  const { data, error } = await supabaseAdmin
    .from('licenses')
    .insert([
      {
        key,
        email,
        type,
        status: 'active',
        product_id,
        stripe_subscription_id: stripe_subscription_id ?? null,
        expires_at: null,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function verifyLicense(key: string) {
  const { data, error } = await supabaseAdmin
    .from('licenses')
    .select('*')
    .eq('key', key)
    .single()

  if (error || !data) return { valid: false }

  if (data.status !== 'active') return { valid: false, reason: 'inactive' }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, reason: 'expired' }
  }

  return { valid: true, license: data }
}