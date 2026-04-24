'use client'
import { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string, productId: string) => {
    setLoading(priceId)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, productId }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setLoading(null)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Anim3D Pro</h1>
      <p className="text-gray-400 mb-12">Rigs et outils professionnels pour Maya</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">

        <div className="bg-gray-900 rounded-2xl p-8 flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Lifetime</h2>
          <p className="text-gray-400 mb-4">Accès à vie à la version actuelle</p>
          <p className="text-4xl font-bold mb-8">15€</p>
          <button
            onClick={() => handleCheckout(
              process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME!,
              'maya-rig-v1'
            )}
            disabled={loading !== null}
            className="mt-auto bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition"
          >
            {loading === process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME ? 'Chargement...' : 'Acheter'}
          </button>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 flex flex-col border border-blue-500">
          <h2 className="text-2xl font-bold mb-2">Abonnement</h2>
          <p className="text-gray-400 mb-4">Tous les rigs et outils futurs inclus</p>
          <p className="text-4xl font-bold mb-8">10€<span className="text-lg text-gray-400">/mois</span></p>
          <button
            onClick={() => handleCheckout(
              process.env.NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION!,
              'maya-rig-subscription'
            )}
            disabled={loading !== null}
            className="mt-auto bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition"
          >
            {loading === process.env.NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION ? 'Chargement...' : "S'abonner"}
          </button>
        </div>

      </div>
    </main>
  )
}