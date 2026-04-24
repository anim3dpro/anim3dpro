import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendLicenseEmail({
  email,
  licenseKey,
  productName,
  licenseType,
}: {
  email: string
  licenseKey: string
  productName: string
  licenseType: 'lifetime' | 'subscription'
}) {
  await resend.emails.send({
    from: 'Anim3D Pro <onboarding@resend.dev>',
    to: email,
    subject: '🎉 Ta licence Anim3D Pro',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #ffffff; padding: 40px; border-radius: 16px;">
        <h1 style="color: #ffffff; margin-bottom: 8px;">Anim3D Pro</h1>
        <p style="color: #94a3b8; margin-bottom: 32px;">Merci pour ton achat !</p>
        
        <h2 style="color: #ffffff;">Ton produit</h2>
        <p style="color: #94a3b8;">${productName} — ${licenseType === 'lifetime' ? 'Accès à vie' : 'Abonnement mensuel'}</p>
        
        <h2 style="color: #ffffff; margin-top: 32px;">Ta clé de licence</h2>
        <div style="background: #1e293b; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 20px; letter-spacing: 2px; color: #60a5fa; text-align: center;">
          ${licenseKey}
        </div>
        
        <p style="color: #94a3b8; margin-top: 32px; font-size: 14px;">
          Conserve cette clé précieusement. Tu en auras besoin pour activer ton rig dans Maya.
        </p>
      </div>
    `,
  })
}